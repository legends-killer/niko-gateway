/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 16:20:49
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const groupRule = {
  name: 'string',
  comment: 'string?',
}

export default class GroupController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody
    const query = ctx.query

    const res = await this.service.group.index(Number(query.id) || 0, query.name, query.comment)

    body.msg = 'success'
    body.error = 0
    body.code = 200
    body.data = {
      group: res[0],
      count: res[1],
    }

    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const body = {} as IBody
    const newGroup = ctx.request.body
    ctx.validate(groupRule, newGroup)

    const res = await this.service.group.create(newGroup)

    body.msg = 'success'
    body.error = 0
    body.code = 200
    body.data = res

    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const id = ctx.params.id
    const body = {} as IBody
    const newGroup = ctx.request.body
    ctx.validate(groupRule, newGroup)
    // update group id is not allowed
    if (newGroup.id) ctx.throw(400, 'update group id is not allowed', { code: 40005 })

    const res = await this.service.group.update(Number(id), newGroup)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const id = ctx.params.id
    const body = {} as IBody

    const res = await this.service.group.destroy(Number(id))

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }
}
