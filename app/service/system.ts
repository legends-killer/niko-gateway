/*
 * @Author: legends-killer
 * @Date: 2021-11-17 19:23:13
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-30 20:45:01
 * @Description:
 */
import { Service } from 'egg'
import {
  ISystemInfo,
  SystemSettingKey,
  ISystemSetting,
  SystemInfoRedisKey,
  SystemSettingOption,
  ISystemSettingEmail,
} from '../../typings/types'

export default class SystemService extends Service {
  async getSystemInfo() {
    const { ctx } = this
    return (await ctx.service.redis.get('system', SystemInfoRedisKey.info)) as ISystemInfo
  }

  async getSystemInfoHistory() {
    const { ctx } = this
    return (await ctx.service.redis.getArr('system', SystemInfoRedisKey.history)) as ISystemInfo[]
  }

  async getSystemConfig(key?: SystemSettingKey) {
    const { ctx } = this
    const db = ctx.repo.System
    const systemSetting = key ? await db.find({ key }) : await db.find({})
    return systemSetting
  }

  async updateSystemConfig(key: SystemSettingKey, value: Partial<ISystemSetting>) {
    const { ctx } = this
    const db = ctx.repo.System
    const systemSetting = await db.findOne({ key })
    if (systemSetting) {
      return await db.update(systemSetting.id, {
        ...systemSetting,
        value: {
          ...value,
        },
      })
    }
    return 0
  }

  async syncConfig() {
    const db = this.ctx.repo.System
    const systemSetting = await db.find({})
    systemSetting.forEach(async (item) => {
      const { key, value } = item
      this.app.config[key] = value as any
      // email config key is special
      if (key === SystemSettingKey.errorEmail) {
        this.app.config.email = value as ISystemSettingEmail
      }
      // sync schedule interval to agent
      if (key === SystemSettingKey.scheduleInterval) {
        this.app.messenger.sendToAgent(SystemSettingOption.SYNC, value)
      }
    })
  }
}
