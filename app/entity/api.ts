/*
 * @Author: legends-killer
 * @Date: 2021-11-17 22:35:55
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-27 17:22:25
 * @Description:
 */
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from 'typeorm'
import { RequestMethod } from '../../typings/types'

const TransNumberArray = {
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

const TransJson = {
  from(val: string) {
    return JSON.parse(val)
  },
  to(val: { [index: string]: string } | undefined) {
    if (!val) return '{}'
    return JSON.stringify(val)
  },
}

@Entity()
@Index(['origin', 'method', 'switch'], { unique: true })
export default class Api {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  comment: string

  @Column('varchar', { transformer: TransNumberArray })
  allowGroup: Array<string | number>

  @Column('varchar', { nullable: false, default: 'get' })
  method: RequestMethod

  @Column('varchar', { nullable: false, default: '/', comment: 'gateway api' })
  origin: string

  @Column('varchar', { comment: 'server address (and port)' })
  server: string

  @Column('varchar', { comment: 'destination service api' })
  dest: string

  @Column('varchar', { transformer: TransJson, comment: 'custom headers', length: 2000 })
  customHeader: { [index: string]: string }

  @Column('bool', { default: false })
  switch: boolean

  @Column('bool', { default: false })
  abTest: boolean

  @Column('bool', { default: false })
  isPublic: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
