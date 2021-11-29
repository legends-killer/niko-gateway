/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 15:56:18
 * @Description:
 */
import 'egg'
import {
  IUserCache,
  IRedisApi,
  IAbTestCache,
  ISystemInfo,
  ISystemSettingSchedule,
  ISystemSettingEmail,
  ISystemSettingErrorReport,
} from './types'
import { Redis } from 'ioredis'
import 'egg-dynamic-email'

declare module 'egg' {
  interface Context {
    user?: IUserCache
    proxy?: IRedisApi
    abTest?: IAbTestCache
    proxyStatus?: number
  }

  // interface Application {
  //   email: {
  //     sendEmail(title: string, info: string, reciver: string, attachment?: Array<any>): Promise<{ code: number; msg: string }>
  //   }
  // }

  interface EggAppConfig {
    system: ISystemInfo // system info & error & warn
    scheduleInterval: ISystemSettingSchedule // schedule interval
    accessKey: {
      // inner API access key
      enable: boolean
      key: string
    }
    errorEmail: ISystemSettingEmail // error report email
    systemErrorReport: ISystemSettingErrorReport // system error report config
    proxyErrorReport: ISystemSettingErrorReport // proxy error report config
    abTestErrorReport: ISystemSettingErrorReport // abTest error report config
    curlSslCheck: boolean // curl ssl check
  }
}
