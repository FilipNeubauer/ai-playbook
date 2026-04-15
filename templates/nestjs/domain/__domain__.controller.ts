// [REST]
import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { __Domain__Service } from "../services/__domain__.service"
import { Create__Domain__Dto } from "../dto/create-__domain__.input.dto"

@Controller("__domain__")
export class __Domain__Controller {
	constructor(private readonly __domain__Service: __Domain__Service) {}

	@Get()
	async findAll() {
		return this.__domain__Service.findAll()
	}

	@Get(":id")
	async findById(@Param("id") id: string) {
		return this.__domain__Service.findById(id)
	}

	@Post()
	async create(@Body() input: Create__Domain__Dto) {
		return this.__domain__Service.create(input)
	}
}
