/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:17:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 15:21:07
 * @Description:
 */
import { Application, Context } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.apiCache.interval || '1m',
      type: 'worker',
      immediate: true,
      disable: false, // enable on only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app, service } = ctx
      try {
        await service.redis.flushDb('api')
        const makeCache = await service.request.makeApiProxyCache()
        if (makeCache) app.logger.error(`[make api cache error] ${makeCache.message}`)
      } catch (error) {
        app.logger.error(`[api cache error] ${error}`)
      }
      ctx.app.config.system.cache.api.syncAt = new Date()
    },
  }
}
