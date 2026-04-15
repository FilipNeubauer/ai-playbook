// [GQL]
import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { ZodValidationException } from "nestjs-zod"
import { ZodType } from "zod"
import { ZOD_VALIDATION } from "../constants/zod-validation.constants"

@Injectable()
export class GlobalZodValidationPipe implements PipeTransform {
	constructor(private reflector: Reflector) {}

	// biome-ignore lint/suspicious/noExplicitAny: pipe transform requires any
	transform(value: any, metadata: ArgumentMetadata) {
		if (!metadata.metatype) {
			return value
		}

		const schema = this.reflector.get<ZodType>(ZOD_VALIDATION, metadata.metatype)

		if (!schema) {
			return value
		}

		try {
			return schema.parse(value)
		} catch (error) {
			throw new ZodValidationException(error)
		}
	}
}
