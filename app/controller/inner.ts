/*
 * @Author: legends-killer
 * @Date: 2021-11-24 22:11:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 20:06:33
 * @Description: 内部接口，访问需要通过配置accessKey，用于跨服务调用（没字段校验）
 */
import { Controller } from 'egg'

export default class InnerController extends Controller {
  // 内部获取user信息
  public async user() {
    const { ctx } = this
    const toekn = ctx.request.body.token
    const user = await ctx.service.user.getUserByAccessToken(toekn)
    ctx.status = 200
    ctx.body = { user: user || {} }
  }
  // 内部获取group信息
  public async group() {
    const { ctx } = this
    const { id, name, comment } = ctx.request.body
    const group = await ctx.service.group.index(id, name, comment)
    ctx.body = group
    ctx.status = 200
  }
}
