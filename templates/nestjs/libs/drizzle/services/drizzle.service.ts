import { Injectable, OnModuleDestroy } from "@nestjs/common"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

@Injectable()
export class DrizzleService implements OnModuleDestroy {
	readonly db: PostgresJsDatabase
	private readonly client: postgres.Sql

	constructor() {
		this.client = postgres(process.env.DATABASE_URL!)
		this.db = drizzle(this.client)
	}

	async onModuleDestroy() {
		await this.client.end()
	}
}
