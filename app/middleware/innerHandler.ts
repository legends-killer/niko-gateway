/*
 * @Author: legends-killer
 * @Date: 2021-11-24 22:15:52
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 20:30:05
 * @Description: 微服务内部路由
 */

import { Context } from 'egg'

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    const { key, enable } = ctx.app.config.accessKey
    if (!enable) {
      ctx.throw(403, 'inner API is not open', { code: 40302 })
    }
    if (!key || key !== ctx.get('accessKey')) {
      ctx.throw(401, 'accessKey is invalid', { code: 40101 })
    }
    await next()
  }
}
