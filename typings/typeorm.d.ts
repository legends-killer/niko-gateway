// This file is created by egg-ts-helper@1.29.1
// Do not modify this file!!!!!!!!!

import 'egg';
import { TreeRepository, Repository } from 'typeorm'
import EntityAbTest from '../app/entity/abTest'
import EntityApi from '../app/entity/api'
import EntityAuthLog from '../app/entity/authLog'
import EntityBiz from '../app/entity/biz'
import EntityGroup from '../app/entity/group'
import EntitySystem from '../app/entity/system'
import EntityUser from '../app/entity/user'
import EntityUserGroupMap from '../app/entity/userGroupMap'

declare module 'egg' {
  interface Context {
    entity: {
      AbTest: typeof EntityAbTest
      Api: typeof EntityApi
      AuthLog: typeof EntityAuthLog
      Biz: typeof EntityBiz
      Group: typeof EntityGroup
      System: typeof EntitySystem
      User: typeof EntityUser
      UserGroupMap: typeof EntityUserGroupMap
    }
    repo: {
      AbTest: Repository<EntityAbTest>
      Api: Repository<EntityApi>
      AuthLog: Repository<EntityAuthLog>
      Biz: Repository<EntityBiz>
      Group: Repository<EntityGroup>
      System: Repository<EntitySystem>
      User: Repository<EntityUser>
      UserGroupMap: Repository<EntityUserGroupMap>
    }
  }
}
