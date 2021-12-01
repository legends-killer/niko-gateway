/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:25:22
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-01 23:20:55
 * @Description:
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import * as path from 'path'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1634561314642_2349'

  // add your egg config in here
  config.middleware = [
    'errorHandler',
    'exampleHandler',
    'innerHandler',
    'authHandler',
    'adminHandler',
    'proxyHandler',
    'bizHandler',
    'abHandler',
  ]
  config.errorHandler = {
    match: ['/'],
  }
  config.exampleHandler = {
    match: ['/'],
  }
  config.innerHandler = {
    match: ['/inner'],
  }
  config.authHandler = {
    ignore: ['/refreshToken', '/auth', '/inner'],
  }
  config.adminHandler = {
    ignore: [/^\/api.*$/, '/refreshToken', '/auth', '/info', '/inner'],
  }
  config.bizHandler = {
    match: /^\/api.*$/,
  }
  config.proxyHandler = {
    match: /^\/api.*$/,
  }
  config.abHandler = {
    match: /^\/api.*$/,
  }

  // proxy logger
  config.customLogger = {
    proxyLogger: {
      file: path.join(appInfo.root, '/logs', appInfo.name, 'proxy.log'),
    },
  }
  config.logger = {
    outputJSON: true,
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
  }
}
