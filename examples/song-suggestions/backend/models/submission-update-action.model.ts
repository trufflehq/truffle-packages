import { IsString, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { DTO } from "./mod.ts";
import { OrgUserModel } from "./org-user.model.ts";
import { SubmissionStatus } from '../types/mod.ts'

export class SubmissionUpdateActionModel {
  @IsString()
  orgId?: string;

  @IsString()
  userId?: string;

  @IsString()
  submissionId?: string;

  @IsString()
  status?: SubmissionStatus;

  @IsString()
  endpoint?: string;

  @ValidateNested()
  @Type(() => OrgUserModel)
  orgUser?: OrgUserModel;
}

export class SubmissionUpdateActionModelDTO implements DTO<SubmissionUpdateActionModel> {
  @ValidateNested()
  @Type(() => SubmissionUpdateActionModel)
  public readonly data?: SubmissionUpdateActionModel;
}
