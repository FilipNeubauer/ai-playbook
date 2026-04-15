// [GQL]
import { registerEnumType } from "@nestjs/graphql"

export function createGQLEnum<T extends Record<string, string>>(enumObj: T, name: string): T {
	registerEnumType(enumObj, { name })
	return enumObj
}
