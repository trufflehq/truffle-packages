import { RoleConnection } from './role.types.ts'
import { ActivePowerupConnection } from './powerup.types.ts'
import { User } from './user.types.ts'
export interface OrgUser {
  id: string;
  name?: string;
  user?: User;
  activePowerupConnection?: ActivePowerupConnection;
  roleConnection?: RoleConnection;
}