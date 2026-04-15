// [GQL]
import { Field, InputType } from "@nestjs/graphql"
import { z } from "zod"
import { ZodValidation } from "../../../libs/common/decorators/zod-validation.decorator"

export const loginInputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
})

type LoginInputSchemaType = z.infer<typeof loginInputSchema>

@InputType("LoginInput")
@ZodValidation(loginInputSchema)
export class LoginInputModel implements LoginInputSchemaType {
	@Field()
	email: string

	@Field()
	password: string
}
