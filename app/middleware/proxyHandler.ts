/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:17:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 16:02:04
 * @Description:
 */
import { Context } from 'egg'
import { RequestMethod, IRedisApi } from '../../typings/types'
import * as lodash from 'lodash'

const hasAccess = (apiConfig: IRedisApi, userGroup: number[]) => {
  const access = lodash.intersection(apiConfig.allowGroup, userGroup).length > 0
  const isOpen = apiConfig.switch
  return access && isOpen
}

export default () => {
  return async function proxyHandler(ctx: Context, next: () => Promise<any>) {
    const config = await ctx.service.request.getProxyConfig(ctx.request.path, RequestMethod[ctx.request.method])
    if (config.isPublic) {
      // public API
      ctx.getLogger('proxyLogger').info('try public proxy', [ctx.request.path, ctx.request.method])
      ctx.proxy = config
      await next()
      const state = ctx.response.status
      // todo: record the result of each ab test for fallback
      if (state === -1) {
        // connection error, maybe timeout or network error
        ctx.getLogger('proxyLogger').error(ctx.response.body)
      } else if (state >= 400) {
        // http error
        ctx.getLogger('proxyLogger').warn(`[code] ${state} [body] ${ctx.body}`)
      }
      return
    }
    // private API
    if (hasAccess(config, ctx.user!.group)) {
      // print proxy log
      ctx.getLogger('proxyLogger').info('try proxy', [ctx.request.path, ctx.request.method, config.allowGroup])
      ctx.app.config.system.proxyInfo.proxy += 1

      config.dest += '?' + ctx.request.querystring
      ctx.proxy = config
      await next()
      const state = ctx.proxyStatus || -1
      // todo: record the result of each ab test for fallback
      if (state === -1) {
        // connection error, maybe timeout or network error
        ctx.getLogger('proxyLogger').error(ctx.response.body)
        ctx.app.config.system.proxyInfo.proxyError += 1
      } else if (state >= 400) {
        // http error
        ctx.getLogger('proxyLogger').warn(`[code] ${state} [body] ${ctx.body}`)
        ctx.app.config.system.proxyInfo.proxyWarn += 1
      }
      ctx.response.status = state
    } else {
      ctx
        .getLogger('proxyLogger')
        .warn('no access to proxy', [ctx.user!.staffId, ctx.request.path, ctx.request.method, config.allowGroup])
      ctx.throw(403, 'you have no access to this api', { code: 40301 })
    }
  }
}
