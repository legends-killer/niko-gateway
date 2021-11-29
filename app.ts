/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:17:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-28 02:58:57
 * @Description:
 */
import { Application } from 'egg'
import Api from './app/entity/api'
import { RouterOption, SystemInfoOption, ISystemInfo, SystemSettingOption, SystemInfoRedisKey } from './typings/types'

// app.js
/**
 * @see https://user-images.githubusercontent.com/40081831/47344271-a688d500-d6da-11e8-96e9-663fa9f45108.png 应用加载逻辑
 */
class AppBootHook {
  private readonly app: Application
  private appBootCache: { [key: string]: any }
  constructor(app: Application) {
    this.app = app
    this.appBootCache = {}
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
  }

  async didLoad() {}

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用
    // 例如：从数据库加载数据到内存缓存
    const ctx = this.app.createAnonymousContext()
    const apiKV = await ctx.service.request.loadApiKv()
    // register router
    Object.keys(apiKV).forEach((key) => {
      const apiInfo = apiKV[key]
      this.app.router[apiInfo.method](apiInfo.origin + apiInfo.method, apiInfo.origin, this.app.controller.proxy[apiInfo.method])
    })
    // init worker, load cache to config
    await this.app.createAnonymousContext().service.util.prepareWorker()
  }

  async didReady() {
    // 应用已经启动完毕
    // add IPC listener
    this.app.messenger.on(RouterOption.ADD, (data: Api) => {
      // add router
      this.app.router[data.method](data.origin, this.app.controller.proxy[data.method])
    })
    this.app.messenger.on(RouterOption.REMOVE, (data: Api) => {
      // remove router
      const routerName = data.origin + data.method
      const stack = this.app.router.stack
      for (const idx in stack) {
        if (stack[idx].name === routerName) {
          stack.splice(Number(idx), 1)
        }
      }
    })
    this.app.messenger.on(SystemInfoOption.SYNC, async (data: ISystemInfo) => {
      // sync system info
      const ctx = this.app.createAnonymousContext()
      await Promise.allSettled([
        ctx.service.redis.set('system', SystemInfoRedisKey.info, data),
        ctx.service.redis.setArr('system', SystemInfoRedisKey.history, data),
      ])
      // maintain history length
      const historyLen = await ctx.service.redis.getArrLen('system', SystemInfoRedisKey.history)
      if (historyLen > 1200) {
        await ctx.service.redis.lPopArr('system', SystemInfoRedisKey.history)
      }
    })
    this.app.messenger.on(SystemSettingOption.SYNC, async () => {
      // sync system setting
      await this.app.createAnonymousContext().service.system.syncConfig()
    })
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例
    // add validator
    this.app.validator.addRule('requestMethod', (rule, value) => {
      try {
        if (!value) throw new Error('request method is required')
        if (!(value === 'get' || value === 'post' || value === 'put' || value === 'delete'))
          throw new Error(`request method is not correct`)
      } catch (err) {
        return (err as any).message
      }
    })
    this.app.validator.addRule('UGMap', (rule, value) => {
      try {
        if (!value || !(value instanceof Array)) throw new Error('UGMap must be an array')
        value.forEach((item) => {
          const ok = [false, false]
          Object.keys(item).forEach((key) => {
            if (key === 'userId' && typeof item[key] === 'number') ok[0] = true
            if (key === 'groupId' && typeof item[key] === 'number') ok[1] = true
          })
          if (!(ok[0] && ok[1])) throw new Error('UGMap item must includes number type userId and groupId ')
        })
      } catch (error) {
        return (error as any).message
      }
    })
  }
}

module.exports = AppBootHook
