/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 04:36:56
 * @Description:
 */
import { EggPlugin } from 'egg'

const plugin: EggPlugin = {
  typeorm: {
    enable: true,
    package: '@hackycy/egg-typeorm',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  eggDynamicEmail: {
    enable: true,
    package: 'egg-dynamic-email',
  },
  // 没必要启动静态资源服务器
  static: {
    enable: false,
  },
}

export default plugin
