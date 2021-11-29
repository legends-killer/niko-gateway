/*
 * @Author: legends-killer
 * @Date: 2021-11-21 18:05:06
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 15:21:26
 * @Description:
 */
import { Application, Context } from 'egg'
import { SystemInfoOption } from '../../typings/types'
import { appInitInfo } from '../../constant'
import * as lodash from 'lodash'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.systemInfoCache.interval || '1m',
      type: 'all',
      immediate: true,
      disable: false, // enable on only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app } = ctx
      try {
        app.messenger.sendToAgent(SystemInfoOption.ADD, app.config.system)
        app.config.system = lodash.cloneDeep(appInitInfo)
      } catch (error) {
        app.logger.error(`[make system info cache error] ${error}`)
      }
    },
  }
}
