/*
 * @Author: legends-killer
 * @Date: 2021-11-04 15:11:30
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 23:26:52
 * @Description:
 */
import { Context } from 'egg'

export default () => {
  return async function abHandler(ctx: Context, next: () => Promise<any>) {
    const proxy = ctx.proxy
    if (proxy?.abTest) {
      const db = ctx.repo.AbTest
      const abTest = await db.findOne({ origin: proxy.origin, method: proxy.method })
      if (abTest) {
        const { current, suspend } = abTest
        let goto = false
        // must not be suspended
        if (!suspend) {
          const random = Math.random() * 100
          if (random < current) {
            goto = true
          }
        }
        ctx.abTest = { ...abTest, goto }
      }
    }
    await next()
    const state = ctx.proxyStatus || -1
    if (ctx.abTest?.goto) {
      // abtest fallback
      if (state === -1 || state >= 500) ctx.app.config.system.proxyInfo.testError += 1
    }
  }
}
