/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:17:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-22 22:28:58
 * @Description:
 */
import { Context } from 'egg'
import * as moment from 'moment'
import { RequestMethod } from '../../typings/types'

export default () => {
  return async function authHandler(ctx: Context, next: () => Promise<any>) {
    const reg = /^\/api.*$/
    let config: any
    let biz: any
    if (reg.test(ctx.request.path)) {
      config = await ctx.service.request.getProxyConfig(ctx.request.path, RequestMethod[ctx.request.method])
      biz = await ctx.service.biz.getBizConfig(config.server)
    }
    if (config && biz && config.isPublic && biz.isPublic) {
      // ignore auth check if this api allow guest access
      await next()
    } else {
      const token = ctx.header.authorization as string | undefined
      if (!token) ctx.throw(401, 'token is required', { code: 40101 })
      const user = await ctx.service.user.getUserByAccessToken(token)
      if (!user) ctx.throw(401, 'user not found', { code: 40104 })
      if (moment(user.accessTokenExp).isBefore(moment())) ctx.throw(401, 'token expired', { code: 40105 })
      // save user info in ctx for the following middlewares
      ctx.user = user

      await next()
    }
  }
}
