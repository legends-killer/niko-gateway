/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 15:21:32
 * @Description:
 */
import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.userCache.interval || '1m',
      type: 'worker',
      immediate: true,
      disable: false, // enable to only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app, service } = ctx
      try {
        await service.redis.flushDb('user')
        const makeCache = await service.user.makeCache()
        if (makeCache) app.logger.error(`[make user cache error] ${makeCache.message}`)
      } catch (error) {
        app.logger.error(`[user cache error] ${error}`)
      }
      ctx.app.config.system.cache.user.syncAt = new Date()
    },
  }
}
