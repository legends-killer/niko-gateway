/*
 * @Author: legends-killer
 * @Date: 2021-11-18 15:34:07
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 15:21:10
 * @Description:
 */
import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.bizCache.interval || '1m',
      type: 'worker',
      immediate: true,
      disable: false, // enable on only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app, service } = ctx
      try {
        await service.redis.flushDb('biz')
        const makeCache = await service.biz.makeBizProxyCache()
        if (makeCache) app.logger.error(`[make biz cache error] ${makeCache.message}`)
      } catch (error) {
        app.logger.error(`[biz cache error] ${error}`)
      }
      ctx.app.config.system.cache.biz.syncAt = new Date()
    },
  }
}
