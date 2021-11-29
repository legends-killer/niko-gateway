/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-18 14:30:32
 * @Description:
 */
import { PrimaryGeneratedColumn, CreateDateColumn, Column, Entity, UpdateDateColumn, Unique } from 'typeorm'

@Entity()
@Unique(['userId', 'groupId'])
export default class UserGroupMap {
  @PrimaryGeneratedColumn()
  id: number

  @Column('varchar', { nullable: false })
  userId: number

  @Column('varchar', { nullable: false })
  groupId: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
