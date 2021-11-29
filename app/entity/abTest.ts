/*
 * @Author: legends-killer
 * @Date: 2021-11-17 22:36:00
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-23 19:10:41
 * @Description:
 */
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { RequestMethod } from '../../typings/types'

@Entity()
@Index(['origin', 'method'], { unique: true })
export default class abTest {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { nullable: false, default: 'get' })
  method: RequestMethod

  @Column('varchar', { nullable: false, default: '/', comment: 'gateway api' })
  origin: string

  @Column('varchar', { nullable: false, default: 'localhost', comment: 'server url' })
  server: string

  @Column('varchar', { nullable: false, default: '/', comment: 'micro service router' })
  dest: string

  @Column('bool', { default: false })
  suspend: boolean

  @Column('int', { comment: 'proxy ratio percent for 2 digits at each increasement' })
  increase: number

  @Column('int', { comment: 'current proxy ratio' })
  current: number

  @Column('int', { comment: 'increasement time gap hours' })
  timeGap: number

  @Column('varchar')
  comment: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
