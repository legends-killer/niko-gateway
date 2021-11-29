/*
 * @Author: legends-killer
 * @Date: 2021-11-12 18:32:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-22 22:29:45
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const bizRule = {
  name: 'string',
  url: 'url',
  api: 'string',
  comment: 'string?',
  allowGroup: { type: 'array', itemType: 'number', required: true, allowEmpty: true },
  isOpen: 'boolean?',
  isPublic: 'boolean?',
}

export default class BizController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody
    const { query } = ctx

    const res = await this.service.biz.index(Number(query.id) || 0, query.name, query.comment)

    body.data = { biz: res[0], count: res[1] }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const body = {} as IBody
    const newBiz = ctx.request.body
    ctx.validate(bizRule, newBiz)

    const res = await this.service.biz.create(newBiz)

    body.data = res
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const body = {} as IBody
    const { id } = ctx.params
    const newBiz = ctx.request.body
    ctx.validate(bizRule, newBiz)

    // avoid update id
    if (newBiz.id) delete newBiz.id

    const res = await this.service.biz.update(Number(id), newBiz)

    body.data = res
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const { id } = ctx.params

    const res = await this.service.biz.destroy(Number(id))

    body.data = res
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
