import { IsString, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { DTO } from "./mod.ts";
import { OrgUserModel } from "./org-user.model.ts";

export class SubmissionsClearActionModel {
  @IsString()
  orgId?: string;

  @IsString()
  userId?: string;

  @IsString()
  endpoint?: string;

  @ValidateNested()
  @Type(() => OrgUserModel)
  orgUser?: OrgUserModel;
}

export class SubmissionsClearActionModelDTO implements DTO<SubmissionsClearActionModel> {
  @ValidateNested()
  @Type(() => SubmissionsClearActionModel)
  public readonly data?: SubmissionsClearActionModel;
}
