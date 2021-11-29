/*
 * @Author: legends-killer
 * @Date: 2021-10-29 16:35:46
 * @LastEditors: legends-killer
 * @LastEditTime: 2021-11-26 21:18:06
 * @Description: user表，根据oAuth提供方按需添加字段，默认GitHub oAuth
 */
import { PrimaryGeneratedColumn, CreateDateColumn, Column, Entity, UpdateDateColumn, Index } from 'typeorm'

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  refreshToken: string

  @Column('datetime')
  refreshTokenExp: Date

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  accessToken: string

  @Column('datetime')
  accessTokenExp: Date

  @Index({ unique: true })
  @Column('varchar', { nullable: false })
  staffId: string

  @Column('varchar')
  staffName: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
