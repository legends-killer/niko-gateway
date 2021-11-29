/*
 * @Author: legends-killer
 * @Date: 2021-11-17 19:17:11
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 14:14:06
 * @Description:
 */
import Api from '../app/entity/api'
import User from '../app/entity/user'
import Biz from '../app/entity/biz'
import abTest from '../app/entity/abTest'
export interface ICasUserInfo {
  staffId: string
  staffName: string
}
export interface IBody {
  data: any
  code: number
  error: any
  msg?: string
}

export type IRedisDbName = 'api' | 'user' | 'biz' | 'system'

export interface IRedisApi extends Api {
  timeOnRedis?: Date
}

export interface IRedisBiz extends Biz {
  timeOnRedis?: Date
}

export enum RequestMethod {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
}

export enum RouterOption {
  ADD = 'addRouter',
  REMOVE = 'removeRouter',
}

export interface IUserCache extends User {
  group: number[]
}

export interface IAbTestCache extends abTest {
  goto: boolean
}

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum LogType {
  COMMONERR = 'common-error.json.log',
  AGENT = 'egg-agent.json.log',
  SCHEDULE = 'egg-schedule.json.log',
  WEB = 'egg-web.json.log',
  APP = 'niko-gateway-web.json.log', // change to your app name
  PROXY = 'proxy.json.log',
}

export interface ILogQuery {
  and: string[]
  or: string[]
  not: string[]
}

export interface ICommonLog {
  level: LogLevel
  date: string
  hostname: string
  message: string
  pid?: number
  paddingMessage?: string
}

export interface ICacheBaseInfo {
  total: number
  missed: number
  syncAt?: Date
  hitRate?: number
}
export interface ICacheProxyInfo {
  // proxy
  proxy: number
  proxyWarn: number
  proxyError: number
  // abTest
  test: number
  testWarn: number
  testError: number
}
export interface ISystemInfo {
  startedAt?: Date
  warn: number
  error: number
  cache: {
    api: ICacheBaseInfo
    biz: ICacheBaseInfo
    user: ICacheBaseInfo
  }
  proxyInfo: ICacheProxyInfo
}

export enum SystemInfoOption {
  ADD = 'addSystemInfo',
  SYNC = 'syncSystemInfo',
}

export enum SystemSettingOption {
  SYNC = 'syncSystemSetting',
}

export enum SystemInfoRedisKey {
  info = 'info',
  history = 'history',
}

export enum SystemSettingKey {
  errorEmail = 'errorEmail',
  systemErrorReport = 'systemErrorReport',
  accessKey = 'accessKey',
  scheduleInterval = 'scheduleInterval',
  proxyErrorReport = 'proxyErrorReport',
  abTestErrorReport = 'abTestErrorReport',
}

export enum ScheduleName {
  apiCache = 'apiCache',
  bizCache = 'bizCache',
  userCache = 'userCache',
  abTest = 'abTest',
  systemInfo = 'systemInfo',
  systemInfoCache = 'systemInfoCache',
  errorDetector = 'errorDetector',
}

export interface ISystemSettingEmail {
  user: string
  password: string
  host: string
  sender: string
  sendTo: string[]
}

export interface ISystemSettingErrorReport {
  enable: boolean
  muteUntil?: Date
  timeThreshold: number
  warnThreshold: number
  errorThreshold: number
}

export type ISystemSettingSchedule = {
  [index in ScheduleName]: { interval: string; enable: boolean }
}

export interface ISystemSettingAccessKey {
  enable: boolean
  key: string
}

export interface ISystemSetting
  extends ISystemSettingEmail,
    ISystemSettingErrorReport,
    ISystemSettingSchedule,
    ISystemSettingAccessKey {}

export enum ErrorEmailType {
  SYSTEM = 'system',
  PROXY = 'proxy',
  ABTEST = 'abTest',
}
