/*
 * @Author: legends-killer
 * @Date: 2021-11-11 22:47:04
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:02:58
 * @Description:
 */
import { Service } from 'egg'

export default class InfoService extends Service {
  async log(userId: number | string) {
    const db = this.ctx.repo.AuthLog
    const log = db.createQueryBuilder()
    log.where('userId = :userId', { userId })
    log.orderBy('createdAt', 'DESC')
    log.take(10)
    return await log.getMany()
  }

  async biz() {
    const db = this.ctx.repo.Biz
    const biz = db.createQueryBuilder('biz')
    biz.select(['biz.id', 'biz.name', 'biz.comment', 'biz.url', 'biz.allowGroup', 'biz.isOpen', 'biz.createdAt'])
    biz.orderBy('createdAt', 'ASC')
    return await biz.getMany()
  }

  async checkToken(token?: string) {
    const db = this.ctx.repo.User
    const tokenInfo = await db.findOne({ accessToken: token })
    return tokenInfo
  }
}
