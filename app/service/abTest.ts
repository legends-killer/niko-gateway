/*
 * @Author: legends-killer
 * @Date: 2021-11-05 10:22:53
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-19 15:10:19
 * @Description:
 */
import { Service } from 'egg'
import abTest from '../entity/abTest'

export default class AbTestService extends Service {
  async index(id?: number, origin?: string, method?: string, comment?: string) {
    const db = this.ctx.repo.AbTest
    const abTest = db.createQueryBuilder()
    abTest.where('true')
    if (id) abTest.andWhere('id = :id', { id })
    if (origin) abTest.andWhere('origin LIKE :origin', { origin: '%' + origin + '%' })
    if (method) abTest.andWhere('method = :method', { method })
    if (comment) abTest.andWhere('comment LIKE :comment', { comment: '%' + comment + '%' })

    abTest.orderBy('createdAt', 'DESC').orderBy('updatedAt', 'DESC')
    return await abTest.getManyAndCount()
  }

  async create(test: abTest) {
    const db = this.ctx.repo.AbTest
    // check if exist
    const exist = await db.findOne({
      origin: test.origin,
      method: test.method,
    })
    if (exist) this.ctx.throw(400, 'abTest already exist', { code: 40001 })

    return await db.save(test)
  }

  async update(id: number, newTest: abTest) {
    const db = this.ctx.repo.AbTest
    const itemWillUpdate = await db.findOne(id)
    if (!itemWillUpdate) this.ctx.throw(400, 'abTest not found', { code: 40002 })

    // check if conflicts
    const dbTest = await db.findOne({
      origin: newTest.origin,
      method: newTest.method,
    })
    if (dbTest && dbTest.id !== Number(id)) this.ctx.throw(400, 'abTest already exist', { code: 40003 })

    return await db.update(id, newTest)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.AbTest
    return await db.delete(id)
  }
}
