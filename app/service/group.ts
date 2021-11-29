/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 18:05:41
 * @Description:
 */
import { Service } from 'egg'
import Group from '../entity/group'

export default class GroupService extends Service {
  async index(id?: number, name?: string, comment?: string) {
    const db = this.ctx.repo.Group
    const group = db.createQueryBuilder()

    group.where('true')
    if (id) group.andWhere('id = :id', { id })
    if (name) group.andWhere('name LIKE :name', { name: '%' + name + '%' })
    if (comment) group.andWhere('comment LIKE :comment', { comment: '%' + comment + '%' })
    group.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await group.getManyAndCount()
  }

  async create(newGroup: Group) {
    const db = this.ctx.repo.Group
    // check if there is already a raw
    const dbGroup = (await db.find({ where: { name: newGroup.name } })).pop()
    if (dbGroup) this.ctx.throw(400, 'group already exists', { code: 40001 })

    return await db.save(newGroup)
  }

  async update(id: number, newGroup: Group) {
    const db = this.ctx.repo.Group
    // check if the item will be updated exists
    const itemWillUpdate = await db.findOne({ id })
    if (!itemWillUpdate) this.ctx.throw(400, 'group not found', { code: 40002 })

    // check if the new api config conflicts
    const dbGroup = (await db.find({ where: { name: newGroup.name } })).pop()
    if (dbGroup && dbGroup.id !== Number(id)) this.ctx.throw(400, 'group conflicts', { code: 40003 })

    return await db.update(id, newGroup)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.Group
    const itemWillDelete = await db.findOne({ id })
    if (itemWillDelete?.default) this.ctx.throw(400, 'default group can not be deleted', { code: 40006 })
    // delete all User-Group map that includes this group
    const UGMap = (await this.service.userGroupMap.index(undefined, undefined, id))[0]
    const mapId: number[] = []
    UGMap.forEach((item) => {
      mapId.push(Number(item.id))
    })
    await this.service.userGroupMap.destroy(mapId)
    await this.service.request.updateAllowGroup()

    return await db.delete(id)
  }

  /**
   * 批量查询组，配合User-Group map使用
   * @param ids number[]
   * @return {Promise} group[]
   */
  async getGroupsByIds(ids: number[]): Promise<[Group[], number]> {
    if (!ids.length) return [[], 0]
    const db = this.ctx.repo.Group
    const group = db.createQueryBuilder()
    group.where('id IN (:...ids)', { ids })

    group.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await group.getManyAndCount()
  }
}
