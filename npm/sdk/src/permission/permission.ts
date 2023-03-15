import { GQLConnection } from '../types/truffle';

export interface TrufflePermission {
  id: string;
  slug: string;
  name: string;
  filters: any;
  action: string;
  value: boolean;
}

export type TrufflePermissionConnection = GQLConnection<TrufflePermission>;
