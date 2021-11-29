/*
 * @Author: legends-killer
 * @Date: 2021-11-12 18:34:17
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 16:14:16
 * @Description:
 */
import { Service } from 'egg'
import Biz from '../entity/biz'
import { IRedisBiz } from '../../typings/types'

export default class BizService extends Service {
  async index(id?: number, name?: string, comment?: string) {
    const db = this.ctx.repo.Biz
    const biz = db.createQueryBuilder()

    biz.where('true')
    if (id) biz.andWhere('id = :id', { id })
    if (name) biz.andWhere('name LIKE :name', { name: '%' + name + '%' })
    if (comment) biz.andWhere('comment LIKE :comment', { comment: '%' + comment + '%' })
    biz.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await biz.getManyAndCount()
  }

  async create(newBiz: Biz) {
    const db = this.ctx.repo.Biz
    // check if there is already a raw
    const dbBiz = (await db.find({ where: { api: newBiz.api } })).pop()
    if (dbBiz) this.ctx.throw(400, 'service already exists', { code: 40001 })

    return await db.save(newBiz)
  }

  async update(id: number, newBiz: Biz) {
    const db = this.ctx.repo.Biz
    // check if the item will be updated exists
    const itemWillUpdate = await db.findOne({ id })
    if (!itemWillUpdate) this.ctx.throw(400, 'service not found', { code: 40002 })

    // check if the new biz config conflicts
    const dbBiz = (await db.find({ where: { api: newBiz.api } })).pop()
    if (dbBiz && dbBiz.id !== Number(id)) this.ctx.throw(400, 'service conflicts', { code: 40003 })

    return await db.update(id, newBiz)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.Biz
    return db.delete(id)
  }

  /**
   * 获取微服务配置
   * 优先尝试缓存
   * 缓存无法命中则尝试数据库
   * @param api api url
   * @return {IRedisBiz} biz config
   */
  async getBizConfig(api: string) {
    // update cache info
    this.app.config.system.cache.biz.total += 1
    const key = api
    const cache = (await this.service.redis.get('biz', key)) as IRedisBiz
    if (!cache || !cache.api) {
      this.app.config.system.cache.biz.missed += 1
      // cache missed
      const db = this.ctx.repo.Biz
      const res = await db.findOne({ api })
      if (!res) {
        this.ctx.throw(404, 'no biz found', { code: 40002 })
      }
      return res as IRedisBiz
    }

    return cache
  }

  /**
   * 从数据库中读出微服务配置
   * 方便redis缓存
   * @return {Object} key value
   */
  async loadBizKv() {
    const db = this.ctx.repo.Biz
    const biz = await db.createQueryBuilder().getMany()
    const bizKV: { [index: string]: Biz } = {}
    biz.forEach((biz) => {
      // redis key
      bizKV[biz.api] = {
        // redis value
        ...biz,
      }
    })
    return bizKV
  }

  /**
   * 更新微服务配置的缓存
   * @return {Error | number} operation result
   */
  async makeBizProxyCache() {
    let err: any = {}
    try {
      const bizKV = await this.loadBizKv()
      this.service.redis.mset('biz', bizKV)
    } catch (error) {
      err = error
    }
    return Object.keys(err).length ? (err as Error) : 0
  }

  /**
   * @deprecated
   */
  async bizCacheToBack() {
    let err: any = {}
    try {
      const keys = await this.service.redis.getAllKey('biz')
      await this.service.redis.moveDb('biz', '5', keys)
    } catch (error) {
      err = error
    }
    return Object.keys(err).length ? (err as Error) : 0
  }
}
