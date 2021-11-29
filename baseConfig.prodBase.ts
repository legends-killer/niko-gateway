/*
 * @Author: legends-killer
 * @Date: 2021-11-21 19:38:47
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 23:30:27
 * @Description: 基础配置模板，不要修改！！！用于初始化数据库。应用启动后可前往控制台修改。
 */
import { ISystemSettingEmail, ISystemSettingErrorReport, ISystemSettingSchedule, ISystemSettingAccessKey } from './typings/types'

// Do NOT modify this file !!!
// init config, it will be saved in database when you deploy the app, or the database is empty
// you can modify the config in admin control center after the app is deployed
export const email: ISystemSettingEmail = {
  user: '', // email account
  password: '', // email password
  host: '', // email smtp host
  sender: '', // email sender xxx@xxx.com
  sendTo: [''], // email send to
}

export const systemErrorReport: ISystemSettingErrorReport = {
  enable: true,
  muteUntil: new Date('1999'), // mute error until
  timeThreshold: 10, // minutes
  warnThreshold: 20, // warn records threshold
  errorThreshold: 10, // error records threshold
}

export const proxyErrorReport: ISystemSettingErrorReport = {
  enable: true,
  muteUntil: new Date('1999'), // mute error until
  timeThreshold: 10, // minutes
  warnThreshold: 100, // warn records threshold
  errorThreshold: 50, // error records threshold
}

export const abTestErrorReport: ISystemSettingErrorReport = {
  enable: true,
  muteUntil: new Date('1999'), // mute error until
  timeThreshold: 10, // minutes
  warnThreshold: 100, // warn records threshold
  errorThreshold: 50, // error records threshold
}

export const scheduleInterval: ISystemSettingSchedule = {
  apiCache: {
    enable: true,
    interval: '1m',
  },
  bizCache: {
    enable: true,
    interval: '1m',
  },
  userCache: {
    enable: true,
    interval: '1m',
  },
  abTest: {
    enable: true,
    interval: '1m',
  },
  systemInfo: {
    enable: true,
    interval: '1m',
  },
  systemInfoCache: {
    enable: true,
    interval: '1m',
  },
  errorDetector: {
    enable: true,
    interval: '1m',
  },
}

// refresh it after deploy
export const accessKey: ISystemSettingAccessKey = {
  enable: true,
  key: 'xxxxxx', // for inner API access
}
