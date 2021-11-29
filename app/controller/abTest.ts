/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:26:52
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-19 15:10:33
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const abTestRule = {
  origin: 'string',
  method: 'requestMethod',
  suspend: 'boolean?',
  increase: {
    type: 'int',
    min: 0,
    max: 100,
  },
  current: {
    type: 'int',
    min: 0,
    max: 100,
  },
  timeGap: 'int', // hours
  server: 'string',
  dest: 'string',
  comment: 'string?',
}

export default class AbTestController extends Controller {
  async index() {
    const { ctx } = this
    const query = ctx.query
    const body = {} as IBody
    const res = await ctx.service.abTest.index(Number(query.id) || undefined, query.origin, query.method, query.comment)

    body.code = 200
    body.data = {
      test: res[0],
      count: res[1],
    }
    body.msg = 'success'
    body.error = 0

    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const body = {} as IBody
    const newTest = ctx.request.body
    ctx.validate(abTestRule, newTest)

    const res = await ctx.service.abTest.create(newTest)

    body.code = 200
    body.data = res
    body.msg = 'success'
    body.error = 0

    ctx.body = body
  }

  async update() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id
    const newTest = ctx.request.body
    ctx.validate(abTestRule, newTest)

    const res = await ctx.service.abTest.update(Number(id), newTest)

    body.code = 200
    body.data = res
    body.msg = 'success'
    body.error = 0

    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const body = {} as IBody
    const id = ctx.params.id

    const res = await ctx.service.abTest.destroy(Number(id))

    body.code = 200
    body.data = res
    body.msg = 'success'
    body.error = 0

    ctx.body = body
  }
}
