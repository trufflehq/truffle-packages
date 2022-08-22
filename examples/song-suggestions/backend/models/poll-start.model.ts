import { IsString, IsUUID, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { DTO } from "./mod.ts";
import { OrgUserModel } from "./org-user.model.ts";

export class PollStartActionModel {
  @IsString()
  orgId?: string;

  @IsString()
  userId?: string;

  @IsString()
  endpoint?: string;
  
  @IsUUID()
  submissionId?: string

  @ValidateNested()
  @Type(() => OrgUserModel)
  orgUser?: OrgUserModel;
}

export class PollStartActionModelDTO implements DTO<PollStartActionModel> {
  @ValidateNested()
  @Type(() => PollStartActionModel)
  public readonly data?: PollStartActionModel;
}
