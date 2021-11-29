/*
 * @Author: legends-killer
 * @Date: 2021-11-11 01:07:09
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-18 14:23:28
 * @Description:
 */
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export default class AuthLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  service: string

  @Column()
  device: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
