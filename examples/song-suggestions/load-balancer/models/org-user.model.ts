import { IsOptional, IsString, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { RoleConnectionModel } from "./role.model.ts";

export class OrgUserModel {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  orgId?: string;

  @IsString({ each: true })
  @IsOptional()
  roleIds?: string[];

  @ValidateNested()
  @Type(() => RoleConnectionModel)
  roleConnection?: RoleConnectionModel;
}
