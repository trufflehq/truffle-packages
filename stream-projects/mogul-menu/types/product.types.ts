import { TruffleGQlConnection } from "../deps.ts";
import { Collectible } from "./collectible.types.ts";

export interface Product {
  id: string;
  description?: string
  source: Collectible<Record<string, unknown>>;
  productVariants: ProductVariantConnection;
}

export type ProductConnection = TruffleGQlConnection<Product>;

export interface ProductVariant {
  amountType: string;
  amountValue: number;
  amountId: string;
}

export type ProductVariantConnection = TruffleGQlConnection<ProductVariant>;
