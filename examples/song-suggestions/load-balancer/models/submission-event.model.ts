
import { IsString, IsOptional, ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "class-transformer";
import { DTO } from "./dto.model.ts";

class SubmissionEventAdditionalDataModel {
  @IsString()
  @IsOptional()
  link?: string
}

class SubmissionEventCollectibleDataModel {
  @IsString()
  eventTopicSlug?: string
  
  @IsString()
  eventTopicId?: string
}

class SubmissionEventRedemptionDataModel {
  @ValidateNested()
  @Type(() => SubmissionEventCollectibleDataModel)
  collectibleData?: SubmissionEventCollectibleDataModel

  @ValidateNested()
  @Type(() => SubmissionEventAdditionalDataModel)
  additionalData?: SubmissionEventAdditionalDataModel

  @IsString()
  orgId?: string

  @IsString()
  userId?: string
}

export class SubmissionEventModel {
  @IsString()
  orgId?: string;


  @IsString()
  eventTopicPath?: string

  @IsString()
  @IsOptional()
  challenge?: string

  @ValidateNested()
  @Type(() => SubmissionEventRedemptionDataModel)
  data?: SubmissionEventRedemptionDataModel
}

export class SubmissionEventModelDTO implements DTO<SubmissionEventModel> {
  @ValidateNested()
  @Type(() => SubmissionEventModel)
  public readonly data?: SubmissionEventModel;
}
