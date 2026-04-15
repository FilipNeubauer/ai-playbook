// [GQL]
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType("__Domain__")
export class __Domain__OutputModel {
	@Field(() => ID)
	id: string

	@Field()
	name: string

	@Field()
	createdAt: Date
}
