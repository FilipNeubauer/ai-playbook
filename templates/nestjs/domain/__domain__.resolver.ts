// [GQL]
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { UseGuards } from "@nestjs/common"
import { __Domain__Service } from "../services/__domain__.service"
import { __Domain__OutputModel } from "../models/outputs/__domain__.output"
import { Create__Domain__InputModel } from "../models/inputs/__domain__.input"
import { JwtAuthGuard } from "../../infra/auth/guards/jwt-auth.guard"
import { CurrentUser } from "../../infra/auth/decorators/current-user.decorator"
import type { JwtPayload } from "../../infra/auth/types/auth.types"

@Resolver(() => __Domain__OutputModel)
@UseGuards(JwtAuthGuard)
export class __Domain__Resolver {
	constructor(private readonly __domain__Service: __Domain__Service) {}

	@Query(() => [__Domain__OutputModel], { name: "__domain__s" })
	async findAll(@CurrentUser() user: JwtPayload): Promise<__Domain__OutputModel[]> {
		return this.__domain__Service.findAll()
	}

	@Mutation(() => __Domain__OutputModel, { name: "create__Domain__" })
	async create(
		@Args("input") input: Create__Domain__InputModel,
		@CurrentUser() user: JwtPayload,
	): Promise<__Domain__OutputModel> {
		return this.__domain__Service.create(input)
	}
}
