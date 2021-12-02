/*
 * @Author: legends-killer
 * @Date: 2021-11-11 22:41:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:04:55
 * @Description:
 */
import { Controller } from 'egg'
import { IBody, IUserCache } from '../../typings/types'
import * as lodash from 'lodash'
import Biz from '../entity/biz'

export default class InfoController extends Controller {
  async index() {
    const { ctx } = this
    const body = {} as IBody

    const res = ctx.user

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    delete res.accessToken
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore:next-line
    delete res.refreshToken

    body.data = res
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  /**
   * get auth logs
   */
  async log() {
    const { ctx } = this
    const body = {} as IBody
    const user = ctx.user as IUserCache

    const res = await this.service.info.log(user.id)

    body.data = { log: res }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  /**
   * 普通用户获取业务服务信息
   */
  async biz() {
    const { ctx } = this
    const body = {} as IBody

    const res = await this.service.info.biz()
    const biz = [] as Biz[] | any
    // filter based on user group
    for (const item of res) {
      if (this.hasAccess(ctx.user as IUserCache, item.allowGroup as number[])) {
        biz.push({
          id: item.id,
          name: item.name,
          comment: item.comment,
          url: item.url,
          isOpen: item.isOpen,
        })
      }
    }

    body.data = { biz }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  hasAccess(user: IUserCache, allowGroup: number[] | undefined) {
    if (!allowGroup || !user.group) return false
    return lodash.intersection(user.group, allowGroup).length > 0
  }

  /**
   * 非管理员获取组信息
   */
  async group() {
    const { ctx } = this
    const body = {} as IBody
    const currentGroup = ctx.user?.group || []
    const groupMap: any = []

    const res = (await this.service.group.index())[0]
    res.forEach((item) => {
      if (currentGroup?.indexOf(item.id) >= 0) {
        groupMap.push({
          id: item.id,
          name: item.name,
          comment: item.comment,
        })
      }
    })

    body.data = { groupMap }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  /**
   * 检查token有效性
   * 不走中间件
   */
  async checkToken() {
    const { ctx } = this
    const body = {} as IBody

    const res = await this.service.info.checkToken(ctx.header.authorization?.toString())

    body.data = { ok: !!res }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
