/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:28:13
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 22:33:02
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
      config.dest = abTest.dest
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
      config.dest = abTest.dest
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
      config.dest = abTest.dest
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
      config.dest = abTest.dest
    }

    const result: any = await this.service.proxy.request(config, 'delete')
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
  async download() {
    const { req } = this.ctx.request
    const { ctx } = this
    const headers = req.headers,
      method: any = req.method,
      config = ctx.proxy!,
      abTest = ctx.abTest
    if (abTest?.goto) {
      config.server = abTest.server
      config.dest = abTest.dest
    }

    const result: any = await ctx.curl(config.server + config.dest, {
      method,
      headers,
      timeout: 25000,
    })
    ctx.set(result.headers)
    ctx.proxyStatus = result.status
    ctx.body = result.data
  }
}

module.exports = ProxyController
