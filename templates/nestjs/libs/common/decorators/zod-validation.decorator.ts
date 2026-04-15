// [GQL]
import { SetMetadata } from "@nestjs/common"
import { ZodType } from "zod"
import { ZOD_VALIDATION } from "../constants/zod-validation.constants"

export const ZodValidation = (schema: ZodType) => SetMetadata(ZOD_VALIDATION, schema)
