import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";

export type RoleSlug = "admin" | "everyone";

export class RoleModel {
  @IsString()
  id?: string;

  @IsString()
  name?: string;

  @IsString()
  slug?: RoleSlug;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsNumber()
  @IsOptional()
  rank?: number;
}

export class RoleConnectionModel {
  @ValidateNested()
  @Type(() => RoleModel)
  nodes?: RoleModel[];
}
