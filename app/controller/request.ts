/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-25 00:07:13
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const apiRule = {
  comment: 'string?', // allow empty string
  origin: 'string',
  server: 'string',
  dest: 'string',
  method: 'requestMethod',
  allowGroup: { type: 'array', itemType: 'number', required: false },
  switch: 'boolean?', // default is false
  isPublic: 'boolean?', // default is false
  customHeader: { type: 'object', required: false },
}

export default class RequestController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody
    const query = ctx.query

    const res = await this.service.request.index(
      Number(query.page) || 1,
      Number(query.ipp) || 10,
      Number(query.id) || undefined,
      query.comment,
      query.origin,
      query.server,
      query.dest,
      query.method
    )

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = {
      api: res[0],
      count: res[1],
    }

    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const body = {} as IBody
    const newApi = ctx.request.body
    ctx.validate(apiRule, newApi)

    const res = await this.service.request.create(newApi)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id
    const newApi = ctx.request.body
    ctx.validate(apiRule, newApi)

    const res = await this.service.request.update(id, newApi)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id

    const res = await ctx.service.request.destroy(id)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }
}
