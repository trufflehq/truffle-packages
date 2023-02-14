import { TrufflePermissionConnection } from '../permission';
import { GQLConnection } from '../types';

export interface TruffleRole {
  id: string;
  slug: string;
  name: string;
  permissionConnection: TrufflePermissionConnection;
}

export type TruffleRoleConnection = GQLConnection<TruffleRole>;
