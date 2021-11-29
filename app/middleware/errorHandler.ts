/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-21 21:30:41
 * @Description:
 */
import { Context } from 'egg'

export default () => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      await next()
    } catch (e) {
      const err = e as any
      if (ctx.app.config.env === 'local') console.log('!!!ERR!!!', err.code, err.message, err.status)
      // record log
      if (!ctx.proxy) {
        ctx.app.emit('error', err, ctx)
      }
      // filter 500 errors when env is prod
      const status = err.status || 500
      const error = status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message

      // set common error message
      ctx.body = { error }

      if (status === 422) {
        ctx.body.code = 42200 // hack 422 error response
        ctx.status = status
        ctx.body.msg = 'validation failed'
        ctx.body.error = err.errors
      } else if (status !== undefined) {
        ctx.body.code = err.code
        ctx.body.msg = 'request failed'
        ctx.status = status
      } else {
        ctx.status = 500
        ctx.body.code = 50000 // fallback
        ctx.body.msg = 'uncaught error'
      }
    }
  }
}
