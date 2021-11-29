/*
 * @Author: legends-killer
 * @Date: 2021-11-18 16:11:14
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-22 21:41:55
 * @Description:
 */
import { Context } from 'egg'
import { IRedisBiz } from '../../typings/types'
import * as lodash from 'lodash'

const hasAccess = (bizConfig: IRedisBiz, userGroup: number[]) => {
  const access = lodash.intersection(bizConfig.allowGroup, userGroup).length > 0
  const isOpen = bizConfig.isOpen
  return { access, isOpen }
}

export default () => {
  return async function proxyHandler(ctx: Context, next: () => Promise<any>) {
    const config = await ctx.service.biz.getBizConfig(ctx.proxy!.server)
    if (config.isPublic) {
      // public Service
      await next()
      return
    }
    // private Service
    const { access, isOpen } = hasAccess(config, ctx.user!.group)
    if (access && isOpen) {
      await next()
    } else if (!access) {
      ctx.getLogger('proxyLogger').warn('no access to biz', [ctx.user!.staffId, ctx.request.url, config.allowGroup])
      ctx.throw(403, 'you have no access to this service', { code: 40301 })
    } else if (!isOpen) {
      ctx.getLogger('proxyLogger').warn('biz is closed', [ctx.user!.staffId, ctx.request.url])
      ctx.throw(403, 'service is closed', { code: 40302 })
    }
  }
}
