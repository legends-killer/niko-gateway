/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 16:21:07
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

const mapRule = {
  map: 'UGMap',
}
const idRule = {
  id: { type: 'array', itemType: 'number' },
}

export default class UserGroupMapController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody
    const query = ctx.query
    if (!query.id && !query.userId && !query.groupId) ctx.throw(400, 'please at least provide a param', { code: 40004 })

    const res = await this.service.userGroupMap.index(query.id ? Number(query.id) : undefined, query.userId, query.groupId)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    const idMap = res[0],
      count = res[1]
    body.data = {
      map: { idMap, count },
    }
    const groupIds = new Set<number>()
    const userIds = new Set<number>()
    idMap.forEach((record) => {
      groupIds.add(record.groupId)
      userIds.add(record.userId)
    })

    // extra query for groups that contain this user
    if (query.userId) {
      const group = await this.service.group.getGroupsByIds(Array.from(groupIds))
      body.data.group = {
        group: group[0],
        count: group[1],
      }
    }

    // extra query for all users in this group
    if (query.groupId) {
      const user = await this.service.user.getUsersByIds(Array.from(userIds))
      body.data.user = {
        user: user[0],
        count: user[1],
      }
    }

    ctx.body = body
  }

  async create() {
    const { ctx } = this
    const body = {} as IBody
    const newMap = ctx.request.body
    ctx.validate(mapRule, newMap)

    const res = await this.service.userGroupMap.create(newMap.map)

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
    const newMap = ctx.request.body
    ctx.validate(mapRule, newMap)

    const res = await this.service.userGroupMap.update(Number(id), newMap)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }

  async destroy() {
    const { ctx } = this
    const query = ctx.request.query.id
    const idObj = {
      id: query.split(',').map((id) => {
        return Number(id)
      }),
    }
    ctx.validate(idRule, idObj)
    const body = {} as IBody

    const res = await this.service.userGroupMap.destroy(idObj.id)

    body.code = 200
    body.msg = 'success'
    body.error = 0
    body.data = res

    ctx.body = body
  }
}
