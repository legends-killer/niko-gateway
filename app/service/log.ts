/*
 * @Author: legends-killer
 * @Date: 2021-11-20 14:12:29
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-21 01:18:57
 * @Description:
 */
import { Service } from 'egg'
import * as fs from 'fs'
import * as path from 'path'
import * as readline from 'readline'
import * as moment from 'moment'
import { LogLevel, LogType, ILogQuery, ICommonLog } from '../../typings/types'

export default class LogService extends Service {
  private async readLog(filePath: string, level?: LogLevel, filter?: ILogQuery, timeFrom?: Date, timeTo?: Date) {
    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    })
    const result: Array<ICommonLog> = []
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: next-line
    for await (const line of rl) {
      const json = JSON.parse(line) as ICommonLog
      const { message, date } = json
      const logLevel = json.level

      if (level && !this.isMatchLevel(level, logLevel)) continue
      if (filter && !this.isMatchFilter(filter, message)) continue
      if (!this.isMatchDate(timeFrom, timeTo, date)) continue

      result.push(json)
    }
    return result
  }

  async getLog(type: LogType, level?: LogLevel, filterStr?: string, date?: Date, timeFrom?: Date, timeTo?: Date) {
    const logPath = this.getFilePath(type, date)
    const filter = filterStr ? this.makeFilter(' ' + filterStr) : undefined

    const log = await this.readLog(logPath, level, filter, timeFrom, timeTo)
    return log
  }

  private getFilePath(type: LogType | string, date?: Date) {
    const { app } = this.ctx
    let fileName = type
    if (date) {
      const dateStr = moment(date).format('YYYY-MM-DD')
      if (dateStr !== moment().format('YYYY-MM-DD')) {
        fileName += '.' + dateStr
      }
    }
    const logPath = path.join(app.config.logger.dir, fileName)

    return logPath
  }

  private makeFilter(filter: string): ILogQuery {
    const and: string[] = []
    const or: string[] = []
    const not: string[] = []
    const keyMap = [' AND ', ' OR ', ' NOT ']
    let i = 0
    while (i < filter.length) {
      let str = filter.slice(i, filter.length)
      let type = ''
      keyMap.forEach((key) => {
        if (str.indexOf(key) === 0) {
          str = str.slice(key.length)
          type = key
        }
      })
      let pos = 0x3f3f3f
      keyMap.forEach((key) => {
        const idx = str.indexOf(key)
        if (idx > 0) pos = Math.min(pos, idx)
      })
      const cur = filter.substr(i + type.length, pos)
      if (cur) {
        if (type === ' AND ') and.push(cur)
        if (type === ' OR ') or.push(cur)
        if (type === ' NOT ') not.push(cur)
      }

      i += pos + type.length
    }

    return { and, or, not }
  }

  private isMatchLevel(level: LogLevel, logLevel: LogLevel) {
    return level === logLevel
  }

  private isMatchFilter(filter: ILogQuery, message: string) {
    const { and, or, not } = filter
    let pass = true
    if (not.length) {
      not.forEach((str) => {
        if (message.includes(str)) {
          pass = false
          return
        }
      })
    }
    if (and.length) {
      and.forEach((str) => {
        if (!message.includes(str)) pass = false
      })
    }
    let orPass = false
    if (or.length) {
      or.forEach((str) => {
        if (message.includes(str)) orPass = true
      })
    } else {
      orPass = true
    }
    if (!pass || !orPass) return false
    return true
  }

  private isMatchDate(from?: Date, to?: Date, logDate?: string) {
    if (!from && !to) return true
    const f = moment(from || moment().startOf('day')),
      t = moment(to),
      cur = moment(logDate)
    return cur.isBetween(f, t, 's', '[]')
  }
}
