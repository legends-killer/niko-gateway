/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 20:23:44
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

export default class UserController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody
    const query = ctx.query

    const res = await this.service.user.index(
      Number(query.page) || 1,
      Number(query.ipp) || 10,
      Number(query.id) || undefined,
      query.staffId,
      query.staffName
    )

    body.code = 200
    body.error = 0
    body.msg = 'success'
    body.data = {
      user: res[0],
      count: res[1],
    }

    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id

    const res = await this.service.user.destroy(Number(id))

    body.code = 200
    body.error = 0
    body.msg = 'success'
    body.data = res

    ctx.body = body
  }
}
