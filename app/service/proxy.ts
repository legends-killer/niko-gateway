/*
 * @Author: legends-killer
 * @Date: 2021-11-19 14:34:11
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 15:56:01
 * @Description:
 */
import { Service } from 'egg'
import { IRedisApi } from '../../typings/types'

export default class ProxyService extends Service {
  async request(config: IRedisApi, method: any) {
    const { ctx } = this
    const { req } = ctx.request
    const customHeader = config.customHeader
    const headers = { ...req.headers }
    const isProd = ctx.app.config.env === 'prod' // set curl param rejectUnauthorized: false
    const sslCheck = isProd && ctx.app.config.curlSslCheck
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
      res =
        method === 'get' || method === 'delete'
          ? await ctx.curl(config.server + config.dest, {
              method: method.toUpperCase(),
              headers,
              rejectUnauthorized: sslCheck,
            })
          : await ctx.curl(config.server + config.dest, {
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
  /**
   * @deprecated use `request` instead
   */
  async get(config: IRedisApi) {
    const { ctx } = this
    const { req } = ctx.request
    const headers = req.headers
    return await ctx.curl(config.server + config.dest, {
      method: 'GET',
      headers,
    })
  }
  /**
   * @deprecated use `request` instead
   */
  async post(config: IRedisApi) {
    const { ctx } = this
    const { req } = ctx.request
    const headers = req.headers
    const data = ctx.request.body
    return await ctx.curl(config.server + config.dest, {
      method: 'POST',
      data,
      headers,
    })
  }
  /**
   * @deprecated use `request` instead
   */
  async put(config: IRedisApi) {
    const { ctx } = this
    const { req } = ctx.request
    const headers = req.headers
    const data = ctx.request.body
    return await ctx.curl(config.server + config.dest, {
      method: 'PUT',
      data,
      headers,
    })
  }
  /**
   * @deprecated use `request` instead
   */
  async del(config: IRedisApi) {
    const { ctx } = this
    const { req } = ctx.request
    const headers = req.headers
    return await ctx.curl(config.server + config.dest, {
      method: 'DELETE',
      headers,
    })
  }
}
