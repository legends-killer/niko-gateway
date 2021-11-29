/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-17 19:43:38
 * @Description:
 */
import { Service } from 'egg'
import UserGroupMap from '../entity/userGroupMap'

export default class userGroupMapService extends Service {
  async index(id?: number, userId?: number | string, groupId?: number | string) {
    const db = this.ctx.repo.UserGroupMap
    const map = db.createQueryBuilder()
    map.where('true')
    if (id) map.andWhere('id = :id', { id })
    if (userId) map.andWhere('userId = :userId', { userId })
    if (groupId) map.andWhere('groupId = :groupId', { groupId })

    map.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await map.getManyAndCount()
  }

  async create(newMap: UserGroupMap[]) {
    const db = this.ctx.repo.UserGroupMap
    if (!newMap.length) return
    const qr = db.createQueryBuilder().insert().values(newMap).orIgnore().getQueryAndParameters()
    return await this.ctx.ormManager.query(qr[0], qr[1])
  }

  async update(id: number, newMap: UserGroupMap) {
    const db = this.ctx.repo.UserGroupMap
    return await db.update(id, newMap)
  }

  async destroy(id: number[]) {
    const db = this.ctx.repo.UserGroupMap
    if (!id.length) return
    return await db.delete(id)
  }
}
