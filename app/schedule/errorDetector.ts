/*
 * @Author: legends-killer
 * @Date: 2021-11-27 01:10:49
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 15:51:15
 * @Description: 错误检测定时任务，检测错误阈值，发送邮件
 */
import { Application, Context } from 'egg'
import { systemErrorReportEmailTemplate } from '../../constant'
import { ISystemInfo, SystemSettingKey, ErrorEmailType } from '../../typings/types'
import * as moment from 'moment'
// errorReportKey type picks from SystemSettingKey
type ErrorReportKey = 'systemErrorReport' | 'proxyErrorReport' | 'abTestErrorReport'
// preProcess return type
interface IErrorThreshold {
  current: {
    warn: number
    error: number
  }
  history: Array<{
    warn: number
    error: number
    timeOnRedis: moment.Moment
  }>
  threshold: {
    warn: number
    error: number
    time: number
  }
}
type TCheckThreshold = (obj, type) => boolean | { warnIncreament: number; errorIncreament: number; type: ErrorEmailType }
type TCheckResult = ReturnType<TCheckThreshold>
const debug = false

/**
 * 判断错误阈值
 * @param obj object return from preProcess
 * @param type ErrorEmailType
 * @return Ret
 */
const checkThreshold = (obj: IErrorThreshold, type: ErrorEmailType): TCheckResult => {
  const { current, history, threshold } = obj
  let warnIncreament = current.warn
  let errorIncreament = current.error

  for (const item of history) {
    if (moment().diff(item.timeOnRedis, 'minutes') <= threshold.time) {
      warnIncreament -= item.warn
      errorIncreament -= item.error
      break
    }
  }
  if (warnIncreament >= threshold.warn || errorIncreament >= threshold.error) {
    return {
      type,
      warnIncreament,
      errorIncreament,
    }
  }
  return false
}

/**
 * 判断是否发送报告
 * @param app Application
 * @param key ErrorReportKey
 * @return boolean
 */
const checkMuteOrDisable = (app: Application, key: ErrorReportKey): boolean => {
  const config = app.config[key]
  const mute = moment().diff(moment(config.muteUntil), 'minutes') < 0 // is mute
  return !config.enable || mute
}

/**
 * 预处理错误信息格式
 * @see SystemSettingKey type
 * @see IPreProcessKey key
 */
const preProcess = (
  app: Application,
  cur: ISystemInfo,
  his: Array<ISystemInfo & { timeOnRedis: Date }>,
  type: ErrorReportKey,
  key?: 'test' | 'proxy'
): IErrorThreshold => {
  let current = {} as any
  let history = [] as any
  const threshold = {
    warn: app.config[type].warnThreshold,
    error: app.config[type].errorThreshold,
    time: app.config[type].timeThreshold,
  }
  if (type === 'systemErrorReport') {
    current = {
      warn: cur.warn,
      error: cur.error,
    }
    history = his.map((item) => {
      return {
        warn: item.warn,
        error: item.error,
        timeOnRedis: moment(item.timeOnRedis),
      }
    })
  } else {
    current = {
      warn: cur.proxyInfo[key! + 'Warn'], // proxyWarn | testWarn
      error: cur.proxyInfo[key! + 'Error'], // proxyError | testError
    }
    history = his.map((item) => {
      return {
        warn: item.proxyInfo[key! + 'Warn'],
        error: item.proxyInfo[key! + 'Error'],
        timeOnRedis: moment(item.timeOnRedis),
      }
    })
  }
  return { current, history, threshold }
}

/**
 * 邮件发送
 * @param app Application
 * @param obj TCheckResult
 * @param key ErrorReportKey
 * @return void
 */
const checkEmailSend = async (app: Application, obj: TCheckResult, key: ErrorReportKey) => {
  if (typeof obj === 'boolean') return
  const { warnIncreament, errorIncreament, type } = obj
  const sendList = app.config[SystemSettingKey.errorEmail].sendTo
  const res = await Promise.allSettled(
    sendList.map((item) => {
      return app.email.sendEmail(key, '', item, [
        {
          data: systemErrorReportEmailTemplate(errorIncreament, warnIncreament, app.config[key], type),
          alternative: true,
        },
      ])
    })
  )
  // logger record
  res.forEach((item) => {
    if (item.status === 'rejected') {
      app.logger.error(`[report email send error]: ${item.status} ${item.reason}`)
    } else {
      const { code, msg } = item.value
      if (code === -1) app.logger.error(`[report email send error]: ${msg}`)
      if (code === 0) app.logger.info(`[report email send success]: ${msg}`)
    }
  })
}

module.exports = (app: Application) => {
  return {
    schedule: {
      interval: app.config.scheduleInterval?.errorDetector.interval || '1m',
      type: 'worker',
      immediate: false,
    },
    async task(ctx: Context) {
      const { app, service } = ctx
      try {
        const { app } = ctx
        const current = await service.system.getSystemInfo()
        const history = (await service.system.getSystemInfoHistory()) as Array<ISystemInfo & { timeOnRedis: Date }>

        const system = preProcess(app, current, history, SystemSettingKey.systemErrorReport)
        const proxy = preProcess(app, current, history, SystemSettingKey.proxyErrorReport, 'proxy')
        const abTest = preProcess(app, current, history, SystemSettingKey.abTestErrorReport, 'test')

        const systemThreshold = checkThreshold(system, ErrorEmailType.SYSTEM)
        const proxyThreshold = checkThreshold(proxy, ErrorEmailType.PROXY)
        const abTestThreshold = checkThreshold(abTest, ErrorEmailType.ABTEST)
        debug && console.log(systemThreshold, proxyThreshold, abTestThreshold)

        const systemDisable = checkMuteOrDisable(app, SystemSettingKey.systemErrorReport)
        const proxyDisable = checkMuteOrDisable(app, SystemSettingKey.proxyErrorReport)
        const abTestDisable = checkMuteOrDisable(app, SystemSettingKey.abTestErrorReport)
        debug && console.log(systemDisable, proxyDisable, abTestDisable)

        !systemDisable && checkEmailSend(app, systemThreshold, SystemSettingKey.systemErrorReport)
        !proxyDisable && checkEmailSend(app, proxyThreshold, SystemSettingKey.proxyErrorReport)
        !abTestDisable && checkEmailSend(app, abTestThreshold, SystemSettingKey.abTestErrorReport)
      } catch (error) {
        app.logger.error(`[error detector error] ${error}`)
      }
    },
  }
}
