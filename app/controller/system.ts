/*
 * @Author: legends-killer
 * @Date: 2021-11-17 19:22:00
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-30 22:26:02
 * @Description:
 */
import { Controller } from 'egg'
import { IBody, ScheduleName, SystemSettingKey, SystemSettingOption } from '../../typings/types'
import { v4 as uuidv4 } from 'uuid'

const settingKeyRule = {
  key: { type: 'enum', values: Object.values(SystemSettingKey) },
}

const settingValueRule = {
  errorEmail: {
    user: 'string?',
    passworld: 'string?',
    host: 'string?',
    port: 'number?',
    sendTo: { type: 'array', itemType: 'email', required: true, allowEmpty: true },
  },
  systemErrorReport: {
    enable: 'boolean',
    muteUntil: 'datetime?',
    timeThreshold: 'number',
    warnThreshold: 'number',
    errorThreshold: 'number',
  },
  proxyErrorReport: {
    enable: 'boolean',
    muteUntil: 'datetime?',
    timeThreshold: 'number',
    warnThreshold: 'number',
    errorThreshold: 'number',
  },
  abTestErrorReport: {
    enable: 'boolean',
    muteUntil: 'datetime?',
    timeThreshold: 'number',
    warnThreshold: 'number',
    errorThreshold: 'number',
  },
  scheduleInterval: Object.keys(ScheduleName)
    .map((key) => {
      return { [ScheduleName[key]]: { type: 'object', rule: { interval: 'string', enable: 'boolean' } } }
    })
    .reduce((a, b) => {
      return { ...a, ...b }
    }),
  accessKey: {
    enable: 'boolean',
    key: 'string?',
  },
}

export default class SystemController extends Controller {
  async userCacheRefresh() {
    const { ctx } = this
    const body = {} as IBody
    const { app, service } = ctx
    app.logger.info(`[refresh user cache manually] operator id:${ctx.user?.id}`)
    try {
      const makeCache = await service.user.makeCache()
      if (makeCache) app.logger.error(`[make user cache error] ${makeCache.message}`)
    } catch (error) {
      app.logger.error(`[user cache error] ${error}`)
      ctx.throw(500, 'faild to make user cache', { code: 50001 })
    }
    ctx.app.config.system.cache.user.syncAt = new Date()
    body.data = {}
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async apiCacheRefresh() {
    const { ctx } = this
    const body = {} as IBody

    ctx.app.logger.info(`[refresh api cache manually] operator id:${ctx.user?.id}`)
    const res = await this.service.request.makeApiProxyCache()

    if (res) {
      ctx.app.logger.error(`[api cache error] ${res.message}`)
      ctx.throw(500, '', { code: 50001 })
    }

    ctx.app.config.system.cache.api.syncAt = new Date()
    body.data = {}
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async bizCacheRefresh() {
    const { ctx } = this
    const body = {} as IBody

    ctx.app.logger.info(`[refresh biz cache manually] operator id:${ctx.user?.id}`)
    const res = await this.service.biz.makeBizProxyCache()

    if (res) {
      ctx.app.logger.error(`[biz cache error] ${res.message}`)
      ctx.throw(500, '', { code: 50001 })
    }

    ctx.app.config.system.cache.biz.syncAt = new Date()
    body.data = {}
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async info() {
    const { ctx } = this
    const body = {} as IBody

    const res = await this.service.system.getSystemInfo()

    body.data = {
      info: res,
    }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async reloadWorker() {
    const { ctx } = this
    const body = {} as IBody

    setTimeout(() => {
      this.service.util.reloadWorker()
    }, 1000)

    body.data = {}
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async getSystemConfig() {
    const { ctx } = this
    const body = {} as IBody
    const key = ctx.query.key

    const res = await this.service.system.getSystemConfig(key as any)

    // if (res?.value.key) res.value.key = '******' // innerAPI key 不显示
    body.data = { config: res }
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }

  async updateSystemConfig() {
    const { ctx } = this
    const body = {} as IBody
    const newRule = ctx.request.body
    ctx.validate(settingKeyRule, newRule)
    ctx.validate(settingValueRule[newRule.key], newRule.value)
    // 随机生成一个accessKey
    if (newRule.key === SystemSettingKey.accessKey) {
      newRule.value.key = uuidv4()
    }

    const res = await this.service.system.updateSystemConfig(newRule.key, newRule.value)
    this.app.messenger.sendToApp(SystemSettingOption.SYNC, {}) // IPC 通知同步配置

    body.data = { ...res }
    if (newRule.value.key) body.data.key = newRule.value.key
    body.code = 200
    body.error = 0
    body.msg = 'success'
    ctx.body = body
  }
}
