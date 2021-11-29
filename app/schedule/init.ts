/*
 * @Author: legends-killer
 * @Date: 2021-11-26 18:32:22
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 15:49:05
 * @Description: 应用初始化，写入db初始值等操作，
 */
import { Context } from 'egg'
import {
  proxyErrorReport,
  systemErrorReport,
  email,
  scheduleInterval,
  accessKey,
  abTestErrorReport,
} from '../../baseConfig.prodBase'
import { SystemSettingKey, SystemSettingOption } from '../../typings/types'

module.exports = () => {
  return {
    schedule: {
      type: 'worker',
      immediate: true, // 仅在启动时之行一次初始化
      disable: false,
    },
    async task(ctx: Context) {
      const { app } = ctx
      try {
        app.logger.info('init system config')
        const group = ctx.repo.Group
        const ugMap = ctx.repo.UserGroupMap
        const sys = ctx.repo.System
        const redis = ctx.service.redis
        await Promise.allSettled([
          ugMap.save({ userId: 1, groupId: 1 }),
          group.save([
            { id: 1, name: 'admin', comment: 'admin(default by system)', default: true },
            { id: 2, name: 'user', comment: 'user(default by system)', default: true },
          ]),
          sys.save([
            { key: SystemSettingKey.errorEmail, value: email, comment: 'email report' },
            { key: SystemSettingKey.systemErrorReport, value: systemErrorReport, comment: 'system error report' },
            { key: SystemSettingKey.accessKey, value: accessKey, comment: 'inner API access key' },
            { key: SystemSettingKey.scheduleInterval, value: scheduleInterval, comment: 'schedule interval' },
            { key: SystemSettingKey.proxyErrorReport, value: proxyErrorReport, comment: 'proxy error report' },
            { key: SystemSettingKey.abTestErrorReport, value: abTestErrorReport, comment: 'ab test error report' },
          ]),
          redis.flushDb('system'),
        ]) // default config
        app.messenger.sendToApp(SystemSettingOption.SYNC, {}) // sync system config to all worker
      } catch (error) {
        app.logger.error(`[init default db error] ${error} (if the error is "duplicate entry", you can ignore it)`)
      }
    },
  }
}
