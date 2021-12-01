/*
 * @Author: legends-killer
 * @Date: 2021-11-05 15:25:22
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-01 17:25:09
 * @Description: Router Definition
 * 👀编写gateway系统接口时不要以/api开头
 * 🐱🐱🐱
 * 以/api开头的为转发接口
 * 通过数据库配置
 * 用于接入其他分布式微服务
 */
import { Application } from 'egg'

export default (app: Application) => {
  const { controller, router } = app

  /**
   * for users
   */
  router.post('/auth', controller.auth.post)
  // router.post('/refreshToken', controller.auth.refreshToken)
  router.get('/info', controller.info.index)
  router.get('/info/log', controller.info.log)
  router.get('/info/biz', controller.info.biz)
  router.get('/info/group', controller.info.group)

  // for admin
  /**
   * cache refresh manually
   */
  router.post('/system/cache/api', controller.system.apiCacheRefresh)
  router.post('/system/cache/user', controller.system.userCacheRefresh)
  router.post('/system/cache/biz', controller.system.bizCacheRefresh)

  /**
   * monitor & system config
   */
  router.get('/system/info', controller.system.info)
  router.post('/system/reload', controller.system.reloadWorker)
  router.post('/system/log', controller.log.post)
  router.get('/system/config', controller.system.getSystemConfig)
  router.put('/system/config', controller.system.updateSystemConfig)

  /**
   * admin config
   */
  router.get('/user', controller.user.index)
  router.del('/user/:id', controller.user.destroy)
  router.resources('request', '/request', controller.request) // proxy api config
  router.resources('group', '/group', controller.group) // group config
  router.resources('userGroupMap', '/userGroupMap', controller.userGroupMap) // user-group map api
  router.resources('abTest', '/abTest', controller.abTest) // ab test api
  router.resources('biz', '/biz', controller.biz) // biz service config

  /**
   * inner router
   */
  router.post('/inner/user', controller.inner.user)
  router.post('/inner/group', controller.inner.group)
}
