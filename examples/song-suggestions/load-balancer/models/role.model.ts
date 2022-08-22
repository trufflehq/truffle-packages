import { IsBoolean, IsNumber, IsOptional, IsString, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { RoleSlug } from '../types/role.types.ts'

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
