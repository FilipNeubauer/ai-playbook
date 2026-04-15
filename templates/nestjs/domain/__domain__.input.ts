// [GQL]
import { Field, InputType } from "@nestjs/graphql"
import { z } from "zod"
import { ZodValidation } from "../../libs/common/decorators/zod-validation.decorator"

export const create__Domain__InputSchema = z.object({
	name: z.string().min(1).max(255),
})

type Create__Domain__InputSchemaType = z.infer<typeof create__Domain__InputSchema>

@InputType("Create__Domain__Input")
@ZodValidation(create__Domain__InputSchema)
export class Create__Domain__InputModel implements Create__Domain__InputSchemaType {
	@Field()
	name: string
}
