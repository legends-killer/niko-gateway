/*
 * @Author: legends-killer
 * @Date: 2021-11-27 17:41:57
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:49:16
 * @Description:
 */
import { ISystemInfo, ISystemSettingErrorReport, ErrorEmailType } from './typings/types'
// do not modify this
export const appInitInfo: ISystemInfo = {
  warn: 0,
  error: 0,
  cache: {
    api: {
      total: 0,
      missed: 0,
      syncAt: new Date('1999'),
    },
    biz: {
      total: 0,
      missed: 0,
      syncAt: new Date('1999'),
    },
    user: {
      total: 0,
      missed: 0,
      syncAt: new Date('1999'),
    },
  },
  proxyInfo: {
    proxy: 0,
    proxyWarn: 0,
    proxyError: 0,
    test: 0,
    testError: 0,
    testWarn: 0,
  },
}

// error report email template
export const systemErrorReportEmailTemplate = (
  error: number,
  warn: number,
  config: ISystemSettingErrorReport,
  type: ErrorEmailType
) => `
<html>
  <body style="font-family: sans-serif, system-ui">
    <h2>This is an error report from Niko-Gateway.</h2>
    <p>
      <strong>
          Niko has found that your ${type} error or warn increased to a threshold
      </strong>
    </p>
    <p>
      <strong>In the last ${config.timeThreshold} mins by your setting</strong>
    </p>
    <p style="color: #ffae00">${type} Warn<strong>${warn}</strong></p>
    <p style="color: #ff0000">${type} Error<strong> ${error}</strong></p>
    <p>Nya~</p>
  </body>
</html>
`

export const TransNumberArray = {
  from: (value: string) => {
    if (value === undefined) return ''
    return value.split(',').map((r) => {
      return Number(r)
    })
  },
  to: (value: Array<string | number> | undefined) => {
    if (value === undefined) return ''
    return value.toString()
  },
}

export const TransJson = {
  from(val: string) {
    return JSON.parse(val)
  },
  to(val: { [index: string]: string } | undefined) {
    if (!val) return '{}'
    return JSON.stringify(val)
  },
}
