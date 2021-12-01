/*
 * @Author: legends-killer
 * @Date: 2021-12-01 15:11:08
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-01 21:45:36
 * @Description:
 */
import { Context } from 'egg'

export default () => {
  return async function exampleHandler(ctx: Context, next: () => Promise<any>) {
    const { request } = ctx
    const { url, method } = request
    if (method === 'PUT') {
      ctx.throw(400, '这只是个example捏，不能修改捏', { code: 40000 })
    }
    if (method === 'POST') {
      const reg = /^\/api.*$/
      const test = reg.test(url)
      if (url.includes('/system/log') || url.includes('/auth') || test) {
        // nya
      } else if (url.includes('/system/reload')) {
        ctx.throw(400, '这只是个example捏，不能重启捏', { code: 40000 })
      } else if (url.includes('/system/cache')) {
        ctx.throw(400, '这只是个example捏，不能刷新捏', { code: 40000 })
      } else {
        ctx.throw(400, '这只是个example捏，不能创建捏', { code: 40000 })
      }
    }
    if (method === 'DELETE') {
      ctx.throw(400, '这只是个example捏，不能删除捏', { code: 40000 })
    }
    await next()
  }
}
