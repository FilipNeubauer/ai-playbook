// [REST]
import { createZodDto } from "nestjs-zod"
import { z } from "zod"

export const create__Domain__Schema = z.object({
	name: z.string().min(1).max(255),
})

export class Create__Domain__Dto extends createZodDto(create__Domain__Schema) {}
