import { Context } from 'egg'
import Group from '../entity/group'

const isAdmin = (group: Group[]) => {
  for (const item of group) {
    if (item.name === 'admin') return true
  }
  return false
}

export default () => {
  return async function adminHandler(ctx: Context, next: () => Promise<any>) {
    // check admin auth
    const groupId = ctx.user?.group as number[]
    const group = (await ctx.service.group.getGroupsByIds(groupId))[0]
    if (isAdmin(group)) {
      await next()
    } else {
      ctx.throw(403, 'you have no access', { code: 40301 })
    }
  }
}
