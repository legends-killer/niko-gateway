/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 00:15:29
 * @Description:
 */
import { Agent } from 'egg'
import * as shell from 'shelljs'
import { ISystemInfo, ISystemSettingSchedule, SystemSettingOption } from './typings/types'
import { SystemInfoOption } from './typings/types'
import * as moment from 'moment'

/**
 * make sure sshpass is installed
 */
class AgentBootHook {
  private readonly agent: Agent
  private systemInfo: ISystemInfo
  constructor(agent: Agent) {
    this.agent = agent
    this.systemInfo = {
      startedAt: new Date(),
      warn: 0,
      error: 0,
      cache: {
        api: {
          total: 0,
          missed: 0,
          syncAt: new Date(),
        },
        biz: {
          total: 0,
          missed: 0,
          syncAt: new Date(),
        },
        user: {
          total: 0,
          missed: 0,
          syncAt: new Date(),
        },
      },
      proxyInfo: {
        proxy: 0,
        proxyError: 0,
        proxyWarn: 0,
        test: 0,
        testWarn: 0,
        testError: 0,
      },
    }
  }
  configWillLoad() {}

  async didLoad() {}

  async willReady() {}

  async didReady() {
    // add IPC listener
    // make summary of system info from all workers
    this.agent.messenger.on(SystemInfoOption.ADD, async (data: ISystemInfo) => {
      const { warn, error, cache, proxyInfo } = data
      this.systemInfo = {
        ...this.systemInfo,
        warn: this.systemInfo.warn + warn,
        error: this.systemInfo.error + error,
        cache: {
          api: {
            ...this.systemInfo.cache.api,
            total: this.systemInfo.cache.api.total + cache.api.total,
            missed: this.systemInfo.cache.api.missed + cache.api.missed,
            syncAt: moment(this.systemInfo.cache.api.syncAt).isAfter(cache.api.syncAt)
              ? moment(this.systemInfo.cache.api.syncAt).toDate()
              : moment(cache.api.syncAt).toDate(),
            hitRate: cache.api.total === 0 ? 0 : (cache.api.total - cache.api.missed) / cache.api.total,
          },
          biz: {
            ...this.systemInfo.cache.biz,
            total: this.systemInfo.cache.biz.total + cache.biz.total,
            missed: this.systemInfo.cache.biz.missed + cache.biz.missed,
            syncAt: moment(this.systemInfo.cache.biz.syncAt).isAfter(cache.biz.syncAt)
              ? moment(this.systemInfo.cache.biz.syncAt).toDate()
              : moment(cache.biz.syncAt).toDate(),
            hitRate: cache.biz.total === 0 ? 0 : (cache.biz.total - cache.biz.missed) / cache.biz.total,
          },
          user: {
            ...this.systemInfo.cache.user,
            syncAt: moment(this.systemInfo.cache.user.syncAt).isAfter(cache.user.syncAt)
              ? moment(this.systemInfo.cache.user.syncAt).toDate()
              : moment(cache.user.syncAt).toDate(),
          },
        },
        proxyInfo: {
          proxy: this.systemInfo.proxyInfo.proxy + proxyInfo.proxy,
          proxyWarn: this.systemInfo.proxyInfo.proxyWarn + proxyInfo.proxyWarn,
          proxyError: this.systemInfo.proxyInfo.proxyError + proxyInfo.proxyError,
          test: this.systemInfo.proxyInfo.test + proxyInfo.test,
          testError: this.systemInfo.proxyInfo.testError + proxyInfo.testError,
          testWarn: this.systemInfo.proxyInfo.testWarn + proxyInfo.testWarn,
        },
      }
    })
    // tell a worker to sync summed appInfo to redis
    this.agent.messenger.on(SystemInfoOption.SYNC, async () => {
      this.agent.messenger.sendRandom(SystemInfoOption.SYNC, this.systemInfo)
    })
    // sync egg-schedule
    this.agent.messenger.on(SystemSettingOption.SYNC, (sch: ISystemSettingSchedule) => {
      this.syncSchedule(sch)
    })

    // run only on dev env
    if (!this.agent.config.dbTunnel.autoConnect) return
    if (this.agent.config.env === 'local') {
      console.log(`\x1B[37;42m checking ssh tunnel status... \x1B[0m`)
      const { code, stdout, stderr } = shell.exec('lsof -i:42200')
      if (code === 0) {
        if (!stdout.includes('ssh')) {
          // port is not available
          console.log(`\x1B[37,41m prot 42200 has been occupied by other connections \x1B[0m`)
        } else {
          // ssh tunnel is already ok
          console.log(
            `\x1B[37;42m ssh tunnel already established at localshost:42200, please close it manually after your development \x1B[0m`
          )
        }
      } else {
        // error or not connected
        if (!stdout) {
          // no output means no connection
          console.log(`\x1B[37;42m try to connect to ssh tunnel for database... \x1B[0m`)
          shell.exec(
            `sshpass -p ${this.agent.config.dbTunnel.pass} ssh -o "ServerAliveInterval=60" -o "StrictHostKeyChecking=no" -L 42200:rm-bp138rx3jy0358hem.mysql.rds.aliyuncs.com:3306 root@${this.agent.config.dbTunnel.tunnel} -NCf`,
            { async: true }
          )
        } else {
          console.log('got error: ' + `\x1B[37,41m ${stderr} \x1B[0m`)
        }
      }
    }
  }

  async beforeClose() {}

  /**
   * 注入egg-schedule来实现 真·动态配置 的定时任务
   * https://github.dev/eggjs/egg-schedule
   */
  syncSchedule(newSchedule: ISystemSettingSchedule) {
    const { agent } = this
    const schedule = (agent as any).schedule
    Reflect.ownKeys(schedule).forEach((key) => {
      // hack symbol equal
      if (key.toString() === `Symbol(strategy_instance)`) {
        const mp = schedule[key] as Map<string, any>
        mp.forEach((v, k) => {
          Object.keys(newSchedule).forEach((k2) => {
            const reg = new RegExp(`${k2}\.(js|ts)$`)
            if (reg.test(k)) {
              const newScheduleItem = newSchedule[k2]
              v.schedule.interval = newScheduleItem.interval
              v.schedule.disable = !newScheduleItem.enable
            }
          })
        })
      }
    })
  }
}

module.exports = AgentBootHook
