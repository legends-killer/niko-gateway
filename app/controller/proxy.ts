/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:28:13
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 16:04:25
 * @Description:
 */
import { Controller } from 'egg'

class ProxyController extends Controller {
  async get() {
    const { ctx } = this
    const config = ctx.proxy!,
      abTest = ctx.abTest
    if (abTest?.goto) {
      config.server = abTest.server
      config.dest = abTest.dest + '?' + ctx.querystring
    }

    const result: any = await this.service.proxy.request(config, 'get')
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
  async post() {
    const { ctx } = this
    const config = ctx.proxy!,
      abTest = ctx.abTest
    if (abTest?.goto) {
      config.server = abTest.server
      config.dest = abTest.dest + '?' + ctx.querystring
    }

    const result: any = await this.service.proxy.request(config, 'post')
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
  async put() {
    const { ctx } = this
    const config = ctx.proxy!,
      abTest = ctx.abTest
    if (abTest?.goto) {
      config.server = abTest.server
      config.dest = abTest.dest + '?' + ctx.querystring
    }

    const result: any = await this.service.proxy.request(config, 'put')
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
  async delete() {
    const { ctx } = this
    const config = ctx.proxy!,
      abTest = ctx.abTest
    if (abTest?.goto) {
      config.server = abTest.server
      config.dest = abTest.dest + '?' + ctx.querystring
    }

    const result: any = await this.service.proxy.request(config, 'delete')
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
}

module.exports = ProxyController
