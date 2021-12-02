/*
 * @Author: legends-killer
 * @Date: 2021-11-19 14:34:11
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 16:08:54
 * @Description:
 */
import { Service } from 'egg'
import { IRedisApi } from '../../typings/types'

export default class ProxyService extends Service {
  async request(config: IRedisApi, method: any) {
    const { ctx } = this
    const customHeader = config.customHeader
    const headers = { ...ctx.request.headers }
    const sslCheck = ctx.app.config.env === 'prod' && ctx.app.config.curlSslCheck
    /**
     * add custom headers
     * transform headers to lowercase
     */
    Object.keys(customHeader).forEach((key) => {
      if (customHeader[key]) {
        headers[key.toLocaleLowerCase()] = customHeader[key]
      } else {
        // empty header means it should not be sent with request
        delete headers[key.toLocaleLowerCase()]
      }
    })

    const data = ctx.request.body
    let res: any
    try {
      res = await ctx.curl(config.server + config.dest, {
        method: method.toUpperCase(),
        data,
        headers,
        rejectUnauthorized: sslCheck,
      })
    } catch (error) {
      res = {
        status: -1,
        data: error,
      }
      return res
    }
    return res
  }
}
