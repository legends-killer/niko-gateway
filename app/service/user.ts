/*
 * @Author: legends-killer
 * @Date: 2021-11-26 16:05:26
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:50:50
 * @Description:
 */
import { Service } from 'egg'
import { IUserCache } from '../../typings/types'
import User from '../entity/user'

export default class UserService extends Service {
  async index(page: number, ipp: number, id?: number, staffId?: string, staffName?: string) {
    const db = this.ctx.repo.User
    const user = db.createQueryBuilder('user')
    user.where('true')
    if (id) user.andWhere('id = :id', { id })
    if (staffId) user.andWhere('staffId = :staffId', { staffId })
    if (staffName) user.andWhere('staffName LIKE :staffName', { staffName: '%' + staffName + '%' })

    user.skip((page - 1) * ipp).take(ipp)
    user.select(['user.id', 'user.staffId', 'user.staffName'])
    user.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await user.getManyAndCount()
  }

  async destroy(id: number) {
    const db = this.ctx.repo.User
    return await db.delete(id)
  }

  async makeCache() {
    let err: any = {}
    try {
      const db = this.ctx.repo.User
      const user = await db.find({})
      const userCache: IUserCache[] = []

      // add group info to cache
      for await (const u of user) {
        const UGMap = (await this.service.userGroupMap.index(undefined, u.id))[0]
        const group: number[] = []

        UGMap.forEach((map) => {
          group.push(Number(map.groupId))
        })

        userCache.push({ ...u, group })
      }

      await Promise.all(
        userCache.map((u) => {
          return this.service.redis.set('user', u.accessToken, u)
        })
      )
    } catch (error) {
      err = error
    }
    return Object.keys(err).length ? (err as Error) : 0
  }

  /**
   * 批量查询用户，配合User-Group map使用
   * @param ids number[]
   * @return {Promise} user[]
   */
  async getUsersByIds(ids: number[]): Promise<any> {
    if (!ids.length) return [[], 0]
    const db = this.ctx.repo.User
    const user = db.createQueryBuilder()
    user.where('id IN (:...ids)', { ids })

    user.orderBy('createdAt', 'DESC').addOrderBy('updatedAt', 'DESC')

    return await user.getManyAndCount()
  }

  /**
   * 单个用户信息缓存
   * @param {User} newUser new user entity
   * @param {boolean} update is update cache
   * @param {User} user old user entity (if update)
   */
  async singleCache(newUser: User, update: boolean, user?: User) {
    if (update) {
      const oldAccess = user!.accessToken
      await this.service.redis.delete('user', oldAccess)
    }

    const UGMap = (await this.service.userGroupMap.index(undefined, newUser.id))[0]
    const group: number[] = []
    UGMap.forEach((map) => {
      group.push(Number(map.groupId))
    })
    await this.service.redis.set('user', newUser.accessToken, { ...newUser, group })
  }

  /**
   * 通过access token获取user
   * @param token access token
   */
  async getUserByAccessToken(token: string) {
    const res = (await this.service.redis.get('user', token)) as IUserCache
    this.app.config.system.cache.user.total += 1
    if (!res) {
      this.app.config.system.cache.user.missed += 1
      const user = await this.ctx.repo.User.findOne({ accessToken: token })
      if (!user) return undefined
      const groups = (user && (await this.service.userGroupMap.index(undefined, user.id))[0]) || []
      return { ...user, group: groups.map((g) => Number(g.groupId)) } as IUserCache
    }
    return res
  }
}
