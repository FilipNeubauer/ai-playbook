// [GQL]
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType("AuthTokenPair")
export class AuthTokenPairOutput {
	@Field()
	accessToken: string

	@Field()
	refreshToken: string
}
