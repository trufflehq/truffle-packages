import {
  IsDate,
  IsString,
  ValidateNested
} from "https://deno.land/x/deno_class_validator@v1.0.0/mod.ts";
import { Type } from "https://esm.sh/class-transformer";
import { DTO } from './mod.ts'

export class MashingConfigModel {
  @IsString()
  orgId?: string;

  // IsUUID doesn't support v1 uuids yet
  @IsString()
  orgUserCounterTypeId?: string;

  @IsDate()
  @Type(() => Date)
  endTime?: Date
}

export class MashingConfigModelDTO implements DTO<MashingConfigModel> {
  @ValidateNested()
  @Type(() => MashingConfigModel)
  public readonly data?: MashingConfigModel
}