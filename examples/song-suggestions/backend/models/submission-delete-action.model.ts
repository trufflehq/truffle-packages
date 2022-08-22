import { IsString, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { DTO } from "./mod.ts";
import { OrgUserModel } from "./org-user.model.ts";

export class SubmissionDeleteActionModel {
  @IsString()
  orgId?: string;

  @IsString()
  userId?: string;

  @IsString()
  submissionId?: string;

  @IsString()
  endpoint?: string;

  @ValidateNested()
  @Type(() => OrgUserModel)
  orgUser?: OrgUserModel;
}

export class SubmissionDeleteActionModelDTO implements DTO<SubmissionDeleteActionModel> {
  @ValidateNested()
  @Type(() => SubmissionDeleteActionModel)
  public readonly data?: SubmissionDeleteActionModel;
}
