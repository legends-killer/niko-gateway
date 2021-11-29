/*
 * @Author: legends-killer
 * @Date: 2021-11-20 19:21:09
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-21 01:21:03
 * @Description:
 */
import { Controller } from 'egg'
import { LogLevel, LogType, IBody } from '../../typings/types'

const logRule = {
  type: 'string',
  level: 'string?',
  filter: 'string?',
  date: 'date?', // YYYY-MM-DD
  timeFrom: 'dateTime?', // YYYY-MM-DD HH:mm:ss
  timeTo: 'dateTime?', // YYYY-MM-DD HH:mm:ss
}
export default class LogController extends Controller {
  async post() {
    const { ctx } = this
    const body = {} as IBody
    const param = {
      type: LogType[ctx.request.body.type?.toUpperCase() ?? undefined],
      level: LogLevel[ctx.request.body.level?.toUpperCase() ?? undefined],
      filter: ctx.request.body.filter,
      date: ctx.request.body.date,
      timeFrom: ctx.request.body.timeFrom,
      timeTo: ctx.request.body.timeTo,
    }
    ctx.validate(logRule, param)

    const res = await this.service.log.getLog(param.type, param.level, param.filter, param.date, param.timeFrom, param.timeTo)

    body.data = {
      log: res,
    }
    body.code = 200
    body.msg = 'success'
    body.error = 0
    ctx.body = body
  }
}
