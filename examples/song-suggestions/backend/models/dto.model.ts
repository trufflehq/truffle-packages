import { ValidateNested } from "$x/deno_class_validator@v1.0.0/mod.ts";

export abstract class DTO<T> {
  @ValidateNested()
  public readonly data?: T;
}
