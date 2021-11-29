/*
 * @Author: legends-killer
 * @Date: 2021-11-21 19:14:29
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 18:54:16
 * @Description:
 */
import { Application, Context } from 'egg'
import { SystemInfoOption } from '../../typings/types'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.systemInfoCache.interval || '1m',
      type: 'worker',
      immediate: true,
      disable: false, // enable on only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app } = ctx
      try {
        app.messenger.sendToAgent(SystemInfoOption.SYNC, app.config.system)
      } catch (error) {
        app.logger.error(`[sync system info cache error] ${error}`)
      }
    },
  }
}
