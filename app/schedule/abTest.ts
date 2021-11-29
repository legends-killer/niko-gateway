/*
 * @Author: legends-killer
 * @Date: 2021-11-20 01:15:49
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 15:21:04
 * @Description:
 */
import { Context, Application } from 'egg'

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.abTest.interval || '1m',
      type: 'worker',
      immediate: true,
      disable: false, // enable on only one server if there are multi machines
    },
    async task(ctx: Context) {
      const { app, service } = ctx
      try {
        const db = ctx.repo.AbTest
        const abTest = await db.find()
        abTest.forEach(async (item) => {
          if (!item.suspend && item.current < 100) {
            const { current, updatedAt, timeGap, increase } = item
            const gap = new Date().getTime() + 30 * 1000 - updatedAt.getTime() // add 30s to offset the schedule execution time
            const div = Math.floor(gap / (timeGap * 1000 * 3600))
            const newRate = current + increase * div > 100 ? 100 : current + increase * div
            await db.update(item.id, { current: newRate })
          }
        })
      } catch (error) {
        app.logger.error(`[update abTest status error] ${error}`)
      }
    },
  }
}
