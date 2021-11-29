/*
 * @Author: legends-killer
 * @Date: 2021-11-26 21:05:53
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 16:07:00
 * @Description: 基本配置，复制到相应环境的配置文件中修改使用
 */
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import { abTestErrorReport, systemErrorReport, email, scheduleInterval, accessKey } from '../baseConfig.prodBase'

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // egg base
  config.security = {
    // 安全相关，详见 https://eggjs.org/zh-cn/core/security.html
    csrf: {
      enable: false,
    },
    domainWhiteList: ['http://localhost:3000'],
  }
  config.cors = {
    // 跨域设置
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }
  config.jwt = {
    // jwt加密秘钥
    secret: appInfo.name + '',
  }

  // app base
  config.cas = {
    // oAuth 相关配置，GitHub为例
    server: 'https://github.com/login/oauth/access_token',
    id: '', // client_id
    secret: '', // client_secret
  }

  // db
  config.dbTunnel = {
    // 是否使用ssh tunnel
    autoConnect: false,
    tunnel: '',
    pass: ``,
  }
  config.typeorm = {
    // orm配置 https://github.com/hackycy/egg-typeorm
    client: {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'niko-prod',
      synchronize: true,
    },
  }

  // redis
  const redisHost = '127.0.0.1'
  const redisPass = '123456'
  const redisPort = 6379
  config.redis = {
    // do not modify
    agent: true,
    app: true,
    clients: {
      api: {
        port: redisPort,
        host: redisHost,
        password: redisPass,
        db: 0,
      },
      user: {
        port: redisPort,
        host: redisHost,
        password: redisPass,
        db: 1,
      },
      biz: {
        port: redisPort,
        host: redisHost,
        password: redisPass,
        db: 2,
      },
      system: {
        port: redisPort,
        host: redisHost,
        password: redisPass,
        db: 3,
      },
    },
  }

  // do not modify
  config.scheduleInterval = scheduleInterval
  config.accessKey = accessKey
  config.email = email
  config.systemErrorReport = systemErrorReport
  config.abTestErrorReport = abTestErrorReport

  // the return config will combines to EggAppConfig
  return {
    ...config,
  }
}
