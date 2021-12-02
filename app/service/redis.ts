/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:50:38
 * @Description:
 */
import { Service, Singleton } from 'egg'
import { Redis } from 'ioredis'
import { IRedisDbName } from '../../typings/types'
import * as moment from 'moment'

export default class RedisService extends Service {
  private redis = this.app.redis as Singleton<Redis> & Redis

  /**
   * single set value and set key expire time
   * @param db redis db name
   * @param key redis key
   * @param value redis value {JSON Object}
   * @param seconds seconds to expire
   * @return Promise<any>
   */
  async set(db: IRedisDbName, key: string, value: any, seconds?: number) {
    const { redis } = this
    value.timeOnRedis = moment().toDate()
    value = JSON.stringify(value)
    if (!seconds) {
      await redis.get(db).set(key, value)
    } else {
      await redis.get(db).expire(key, seconds)
      return await redis.get(db).set(key, value)
    }
  }

  /**
   * multi set value
   * @param db redis db name
   * @param obj redis key value {string - JSON Object}
   * @return Promise<any>
   */
  async mset(db: IRedisDbName, obj: { [key: string]: any }) {
    const { redis } = this
    let empty = true
    for (const key in obj) {
      obj[key] = JSON.stringify({ ...obj[key], timeOnRedis: moment().toDate() })
      empty = false
    }
    if (empty) return
    return await redis.get(db).mset(new Map(Object.entries(obj)))
  }

  /**
   * get value by key
   * @param db redis db name
   * @param key redis key
   * @return {Promise<any>} JSON Object
   */
  async get(db: IRedisDbName, key: string) {
    const { redis } = this
    const data = await redis.get(db).get(key)
    if (!data) return
    return JSON.parse(data)
  }

  /**
   * delete redis value by key
   * @param db redis db name
   * @param key redis key
   * @return Promise<number>
   */
  async delete(db: IRedisDbName, key: string) {
    return await this.redis.get(db).del(key)
  }

  /**
   * set value into array
   * @param db redis db name
   * @param key redis key
   * @param value redis value {JSON Object}
   * @param seconds seconds to expire
   * @return Promise<any>
   */
  async setArr(db: IRedisDbName, key: string, value: any, seconds?: number) {
    // append timestrap to redis array
    const { redis } = this
    value.timeOnRedis = moment().toDate()
    value = JSON.stringify(value)
    if (!seconds) {
      await redis.get(db).rpush(key, value)
    } else {
      await redis.get(db).expire(key, seconds)
      return await redis.get(db).rpush(key, value)
    }
  }

  /**
   * get an array by key
   * @param db redis db name
   * @param key redis key
   * @return Array<{JSON Object}>
   */
  async getArr(db: IRedisDbName, key: string) {
    const { redis } = this
    const data = await redis.get(db).lrange(key, 0, -1)
    if (!data) return
    return data.map((d) => {
      return JSON.parse(d)
    })
  }

  /**
   * delete value in array by key and count
   * @param db redis db name
   * @param key redis key
   * @param count redis lram count
   * @param value redis value {string}
   * @return Promise<number>
   */
  async delArrItem(db: IRedisDbName, key: string, count: number, value: string) {
    const { redis } = this
    return await redis.get(db).lrem(key, count, value)
  }

  /**
   * get array length
   * @param db redis db name
   * @param key redis key
   * @return Promise<number>
   */
  async getArrLen(db: IRedisDbName, key: string) {
    const { redis } = this
    return await redis.get(db).llen(key)
  }

  /**
   * pop value from array
   * @param db redis db name
   * @param key redis key
   * @return Promise<string>
   */
  async lPopArr(db: IRedisDbName, key: string) {
    const { redis } = this
    return await redis.get(db).lpop(key)
  }

  async getAllKey(db: IRedisDbName) {
    const { redis } = this
    return await redis.get(db).keys('*')
  }

  async flushAll() {
    const { redis } = this
    return await redis.flushall()
  }

  async flushDb(db: IRedisDbName) {
    const { redis } = this
    return await redis.get(db).flushdb()
  }
}
