import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { appConfigTable } from "../db/schemas/app-config.schema"

async function seed() {
	const client = postgres(process.env.DATABASE_URL!)
	const db = drizzle(client)

	console.log("Seeding app_config...")

	await db
		.insert(appConfigTable)
		.values([
			{ key: "app_force_update_enabled", value: "true" },
			{ key: "app_min_version_ios", value: "1.0.0" },
			{ key: "app_min_version_android", value: "1.0.0" },
			{ key: "app_store_url_ios", value: "https://apps.apple.com/app/id__PROJECT_ID__" },
			{ key: "app_store_url_android", value: "https://play.google.com/store/apps/details?id=com.__project__" },
		])
		.onConflictDoNothing()

	console.log("Seeding complete.")
	await client.end()
	process.exit(0)
}

seed()
