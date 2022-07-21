import { IsString, ValidateNested } from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "https://esm.sh/class-transformer";
import { DTO } from "./dto.ts";
import { OrgUserModel } from "./org-user.model.ts";

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
  orgUser?: OrgUserModel;
}

export class IncrementModelDTO implements DTO<IncrementModel> {
  @ValidateNested()
  @Type(() => IncrementModel)
  public readonly data?: IncrementModel;
}
