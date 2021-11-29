/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-18 14:35:24
 * @Description:
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity()
export default class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column('varchar', { nullable: false, default: 'no name' })
  name: string

  @Column('varchar')
  comment: string

  @Column('bool', { default: false })
  default: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
