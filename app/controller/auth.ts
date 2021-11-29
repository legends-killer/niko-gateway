/*
 * @Author: legends-killer
 * @Date: 2021-11-03 15:31:20
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 21:19:35
 * @Description:
 */
import { Controller } from 'egg'
import { IBody } from '../../typings/types'

export default class AuthController extends Controller {
  async post() {
    const { ctx } = this
    const body = {} as IBody
    const ticket = ctx.query.ticket || ''
    const service = ctx.query.service || ''
    const device = ctx.query.device || ''
    if (!ticket) {
      ctx.throw(401, 'ticket not found', { code: 40101 })
    }
    const res = await this.service.auth.casAuth(ticket, service, device)

    // 前后端分离部署，不设置refreshToken
    // ctx.cookies.set('refreshToken', res.refreshToken, { path: '/refreshToken' })
    body.data = { accessToken: res.accessToken, redirectUrl: res.redirectUrl }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async refreshToken() {
    const { ctx } = this
    const body = {} as IBody
    const refreshToken = ctx.cookies.get('refreshToken')

    const res = await this.service.auth.refreshAccess(refreshToken)

    ctx.cookies.set('refreshToken', res.refreshToken, { path: '/refreshToken' })
    body.data = { accessToken: res.accessToken }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
