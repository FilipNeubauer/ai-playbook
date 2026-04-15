import { Injectable, OnModuleDestroy } from "@nestjs/common"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { EnvVariableService } from "../../common/services/env-variable.service"
import { EnvVariable } from "../../common/constants/env-variable.constants"

@Injectable()
export class DrizzleService implements OnModuleDestroy {
	readonly db: PostgresJsDatabase
	private readonly client: postgres.Sql

	constructor(private readonly env: EnvVariableService) {
		this.client = postgres(this.env.get(EnvVariable.DatabaseUrl))
		this.db = drizzle(this.client)
	}

	async onModuleDestroy() {
		await this.client.end()
	}
}
