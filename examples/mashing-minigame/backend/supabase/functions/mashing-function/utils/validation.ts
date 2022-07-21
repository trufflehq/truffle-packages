import { BadRequestError } from "alosaur/mod.ts";
import { validate } from "$x/deno_class_validator@v1.0.0/mod.ts";
import { DTO } from "../models/mod.ts";

export async function validateDTO<T>(dto: DTO<T>) {
  const validationErrors = await validate(dto);
  if (validationErrors?.length) {
    throw new BadRequestError(JSON.stringify(validationErrors));
  }
}
