/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:17:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 13:35:41
 * @Description:
 */
import { Service } from 'egg'
import * as moment from 'moment'
import * as lodash from 'lodash'
import { appInitInfo } from '../../constant'

export default class UtilService extends Service {
  reloadWorker() {
    this.logger.warn(`worker reboot at ${moment().toString()}`)
    process.send!({ to: 'master', action: 'reload-worker' })
  }

  generateJWT(user: string | object | Buffer) {
    return this.app.jwt.sign(user, this.app.config.jwt.secret)
  }

  /**
   * prapare worker, init configs
   */
  async prepareWorker() {
    const { app } = this
    app.logger.info('preparing worker... synchronizing config to workers')
    await this.service.system.syncConfig()
    app.config.system = lodash.cloneDeep(appInitInfo)
  }
}
