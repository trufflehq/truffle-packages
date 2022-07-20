import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  ValidateNested
} from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "https://esm.sh/class-transformer";
import { DTO } from './mod.ts'

export class RoleModel {
  @IsString()
  id?: string

  @IsString()
  name?: string

  @IsString()
  slug?: string

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean

  @IsNumber()
  @IsOptional()
  rank?: number
}

export class RoleConnectionModel {
  @ValidateNested()
  @Type(() => RoleModel)
  nodes?: RoleModel[]
}

export class OrgUserModel {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  orgId?: string;

  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[]

  @ValidateNested()
  @Type(() => RoleConnectionModel)
  roleConnection?: RoleConnectionModel
}

export class IncrementModel {
  // IsUUID doesn't support v1 uuids yet
  @IsString()
  userId?: string;

  @IsString()
  orgId?: string;

  @IsString()
  endpoint?: string;

  @ValidateNested()
  @Type(() => OrgUserModel)
  orgUser?: OrgUserModel
}

export class IncrementModelDTO implements DTO<IncrementModel> { 
  @ValidateNested()
  @Type(() => IncrementModel)
  public readonly data?: IncrementModel
}