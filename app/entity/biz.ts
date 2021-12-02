/*
 * @Author: legends-killer
 * @Date: 2021-11-12 18:38:51
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-12-02 15:48:42
 * @Description: 防止关键字冲突，使用bizService
 */
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { TransNumberArray } from '../../constant'

@Entity()
export default class Biz {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar')
  name: string

  @Column('varchar')
  comment: string

  @Column('varchar', { nullable: false })
  url: string

  @Index({ unique: true })
  @Column('varchar', { nullable: false, default: 'localhost' })
  api: string

  @Column('varchar', { transformer: TransNumberArray })
  allowGroup: Array<string | number> | undefined

  @Column('bool', { default: true })
  isOpen: boolean

  @Column('bool', { default: false })
  isPublic: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
