export interface AccessTokenPayload {
  sub: string;
  nonce: number;
  type: string;
  isAnon: boolean;
  orgId?: string;
  orgMemberId?: string;
  packageId?: string;
  packageInstallId?: string;
}

export interface OrgMemberInput {
  id?: string;
  orgId?: string;
  orgIdAndUserId?: {
    orgId: string;
    userId: string;
  };
}

export interface OrgPayload {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  timezone: string;
  image?: any; // TODO: make a type for this
  socials?: any; // TODO: make a type for this
  creatorUserId: string;
}

export interface OrgMemberPayload {
  id: string;
  name: string;
}

export interface RolePayload {
  id: string;
  slug: string;
}

export interface SparkBalancePayload {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface ProductVariantPayload {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
}

export interface ProductPayload {
  id: string;
  name: string;
  slug: string;
  category: string;
  variants: ProductVariantPayload[];
}

export interface ProductVariantPurchasePayload {
  id: string;
  name: string;
  slug: string;
}
