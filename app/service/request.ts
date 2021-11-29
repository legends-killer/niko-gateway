/*
 * @Author: legends-killer
 * @Date: 2021-11-26 16:05:26
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 16:20:02
 * @Description:
 */
import { Service } from 'egg'
import Api from '../entity/api'
import { IRedisApi, RequestMethod, RouterOption } from '../../typings/types'
import * as lodash from 'lodash'

export default class RequsetService extends Service {
  async index(
    page: number,
    ipp: number,
    id?: number,
    comment?: string,
    origin?: string,
    server?: string,
    dest?: string,
    method?: string
  ) {
    const db = this.ctx.repo.Api
    const api = db.createQueryBuilder()
    api.where('true')
    if (id) api.andWhere('id = :id', { id })
    if (comment) api.andWhere('comment LIKE :comment', { comment: '%' + comment + '%' })
    if (origin) api.andWhere('origin LIKE :origin', { origin: '%' + origin + '%' })
    if (server) api.andWhere('server LIKE :server', { server: '%' + server + '%' })
    if (dest) api.andWhere('dest LIKE :dest', { dest: '%' + dest + '%' })
    if (method) api.andWhere('method = :method', { method })

    api.skip((page - 1) * ipp).take(ipp)
    api.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await api.getManyAndCount()
  }

  async create(newApi: Api) {
    const db = this.ctx.repo.Api
    // check if there is already a row
    const dbApi = (
      await db.find({ where: { origin: newApi.origin, method: newApi.method, switch: newApi.switch || false } })
    ).pop()
    if (dbApi) this.ctx.throw(400, 'api proxy config already exists', { code: 40001 })

    // app router hot update
    this.broadcastModifyRouter(newApi, RouterOption.ADD)

    return await db.save(newApi)
  }

  async update(id: number, newApi: Api) {
    const db = this.ctx.repo.Api
    // check if the item will be updated exists
    const itemWillUpdate = await db.findOne({ id })
    if (!itemWillUpdate) this.ctx.throw(400, 'api proxy config not found', { code: 40002 })

    // check if the new api config conflicts
    const dbApi = (
      await db.find({ where: { origin: newApi.origin, method: newApi.method, switch: newApi.switch || false } })
    ).pop()
    if (dbApi && dbApi.id !== Number(id)) this.ctx.throw(400, 'api proxy config conflicts', { code: 40003 })

    // app router hot update only when the origin or method changed
    if (itemWillUpdate.origin !== newApi.origin || itemWillUpdate.method !== newApi.method) {
      this.broadcastModifyRouter(itemWillUpdate, RouterOption.REMOVE)
      this.broadcastModifyRouter(newApi, RouterOption.ADD)
    }

    return await db.update(id, newApi)
  }

  async destroy(id: number) {
    const db = this.ctx.repo.Api

    const itemWillDelete = await db.findOne({ id })
    // app router hot update
    if (itemWillDelete) this.broadcastModifyRouter(itemWillDelete, RouterOption.REMOVE)

    return await db.delete(id)
  }

  /**
   * 获取转发接口配置
   * 优先尝试缓存
   * 缓存无法命中则尝试数据库
   * @param origin origin path
   * @param method http method
   * @return {IRedisApi} proxy config
   */
  async getProxyConfig(origin: string, method: RequestMethod) {
    // update cache info
    this.ctx.app.config.system.cache.api.total += 1
    const key = origin + method
    const cache = (await this.service.redis.get('api', key)) as IRedisApi
    if (!cache || !cache.server || !cache.dest) {
      // cache missed
      this.ctx.app.config.system.cache.api.missed += 1
      const db = this.ctx.repo.Api
      const res = await db.findOne({ origin, method })
      if (!res || !res.server || !res.dest) {
        this.ctx.throw(404, 'no proxy rule found', { code: 40002 })
      }
      return res as IRedisApi
    }

    return cache
  }

  /**
   * 从数据库中读出当前转发请求配置
   * 方便redis缓存
   * @return {Object} key value
   */
  async loadApiKv() {
    const db = this.ctx.repo.Api
    const api = await db.createQueryBuilder().getMany()
    const apiKV: { [index: string]: Api } = {}
    api.forEach((api) => {
      // redis key
      apiKV[api.origin + api.method] = {
        // redis value
        ...api,
      }
    })
    return apiKV
  }

  /**
   * 更新转发接口的缓存
   * @return {Error | number} operation result
   */
  async makeApiProxyCache() {
    let err: any = {}
    try {
      const apiKV = await this.loadApiKv()
      await this.service.redis.mset('api', apiKV)
    } catch (error) {
      err = error
    }
    return Object.keys(err).length ? (err as Error) : 0
  }

  /**
   * @deprecated
   */
  async apiCacheToBack() {
    let err: any = {}
    try {
      const keys = await this.service.redis.getAllKey('api')
      await this.service.redis.moveDb('api', '1', keys)
    } catch (error) {
      err = error
    }
    return Object.keys(err).length ? (err as Error) : 0
  }

  /**
   * 通过IPC管道更新每个app的router
   * @param {Api} api Api entity
   * @param {RouterOption} option add or remove
   */
  broadcastModifyRouter(api: Api, option: RouterOption) {
    this.app.messenger.broadcast(option, api)
  }

  async updateAllowGroup() {
    // update allowGroup column for api table
    // 手动实现外键
    const { ctx } = this
    const db = ctx.repo.Api
    const api = await db.find()
    const group = (await ctx.service.group.index())[0]
    const ids = group.map((g) => {
      return g.id
    })
    const apiList = api.map((item) => {
      const allowGroup = item.allowGroup as number[]
      const newAllowGroup = lodash.intersection(allowGroup, ids)
      return {
        ...item,
        allowGroup: newAllowGroup,
      }
    })
    await db.save(apiList)
  }
}
