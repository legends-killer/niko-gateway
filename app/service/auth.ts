/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-30 00:26:47
 * @Description:
 */
import { Service } from 'egg'
import { v4 as uuidv4 } from 'uuid'
import * as xml2js from 'xml2js'
import * as moment from 'moment'
import { ICasUserInfo } from '../../typings/types'
import User from '../entity/user'
import AuthLog from '../entity/authLog'

export default class AuthService extends Service {
  async casAuth(ticket: string, service: string, device: string) {
    const db = this.ctx.repo.User
    // check if redirectUrl is valid
    await this.checkRedirectService(service)

    const anonymousCtx = this.app.createAnonymousContext()
    const cas = this.app.config.cas

    const casRes = await anonymousCtx.curl(cas.server, {
      method: 'POST',
      dataAsQueryString: true, // data is sent as query string
      data: {
        code: ticket,
        client_id: cas.id,
        client_secret: cas.secret,
      },
      headers: { accept: 'application/json' },
    })
    const casResJson = JSON.parse(casRes.data.toString())
    if (casResJson.error) this.ctx.throw(401, 'ticket is invalid', { code: 40102 })
    const casUser = (await this.getUserInfoByGithub(casResJson.access_token)) as ICasUserInfo

    const user = await db.findOne({ staffId: casUser.staffId })

    const newUser = this.updateUserToken(user, casUser)

    if (user) {
      // revoke old token in cache & update cache
      await this.service.user.singleCache(newUser, true, user)
      await db.update(newUser.id, newUser)
    } else {
      // save to db
      const res = await db.save(newUser)
      // add to user group
      await this.service.userGroupMap.create([{ userId: res.id, groupId: 2 } as any])
      // save to cache, add default group
      await this.service.user.singleCache(res, false)
    }
    // save auth log
    this.saveAuthLog({ service, device, userId: newUser.id } as AuthLog)
    return { refreshToken: newUser.refreshToken, accessToken: newUser.accessToken, redirectUrl: service }
  }

  async refreshAccess(refreshToken: string) {
    const db = this.ctx.repo.User
    const user = await db.findOne({ refreshToken })
    // check if refreshToken is valid
    if (!user || moment(user?.refreshTokenExp).isBefore(moment()))
      this.ctx.throw(401, 'refresh token is invalid', { code: 40103 })

    const newUser = this.updateUserToken(user)
    await db.update(newUser.id, newUser)

    // update redis cache
    await this.service.user.singleCache(newUser, true, user)

    return { refreshToken: newUser.refreshToken, accessToken: newUser.accessToken }
  }

  async saveAuthLog(log: AuthLog) {
    const db = this.ctx.repo.AuthLog
    return await db.save(log)
  }

  /**
   * to resolve xml message from cas server
   * @param xml string
   * @return {ICasUserInfo} cas user info in user entity
   */
  formatCas(xml: string): ICasUserInfo {
    const tempUser = {} as ICasUserInfo
    // do your format operation...

    return tempUser
  }

  async getUserInfoByGithub(accessToken: string) {
    const anonymousCtx = this.app.createAnonymousContext()
    const userInfoRes = await anonymousCtx.curl('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/json',
      },
    })
    const tempUser = JSON.parse(userInfoRes.data.toString())
    return {
      staffId: tempUser.id,
      staffName: tempUser.name,
    }
  }

  /**
   * update refreshToken and accessToken
   * @param user user entity
   * @param casUser cas user info
   * @return {User} user entity with updated refreshToken
   */
  updateUserToken(user: User | undefined, casUser?: ICasUserInfo): User {
    const jwtInfo = {
      staffId: user?.staffId || casUser?.staffId,
      staffName: casUser?.staffName || casUser?.staffName,
    }
    // always update accessToken
    const accessToken = this.service.util.generateJWT(jwtInfo)
    const accessTokenExp = moment().add(7, 'days').toDate()

    // update refreshToken when it will be expired in a day
    const willExpired = moment(user?.refreshTokenExp).isBefore(moment().add(1, 'days'))
    // update refreshToken
    const refreshToken = willExpired ? uuidv4() : user?.refreshToken
    // update refreshToken expire date
    const refreshTokenExp = willExpired ? moment().add(7, 'days').toDate() : user?.refreshTokenExp

    const newUser = {
      ...user,
      ...casUser,
      refreshToken,
      refreshTokenExp,
      accessToken,
      accessTokenExp,
    } as User
    return newUser
  }

  async checkRedirectService(service: string) {
    if (!service) return
    const db = this.ctx.repo.Biz
    const biz = await db.findOne({ url: service })
    if (!biz) {
      this.ctx.throw(403, 'redirect is invalid', { code: 40401 })
    }
  }
}
