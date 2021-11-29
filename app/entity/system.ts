/*
 * @Author: legends-killer
 * @Date: 2021-11-27 01:22:47
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-29 15:48:00
 * @Description: Save system settings by key and value
 */
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { SystemSettingKey, ISystemSetting } from '../../typings/types'

const TransJson = {
  from(val: string) {
    return JSON.parse(val)
  },
  to(val: { [key: string]: any } | undefined) {
    if (!val) return '{}'
    return JSON.stringify(val)
  },
}

@Entity()
export default class System {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { unique: true })
  key: SystemSettingKey

  @Column('varchar', { nullable: false, transformer: TransJson, length: 2000 })
  value: Partial<ISystemSetting>

  @Column('varchar')
  comment: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
