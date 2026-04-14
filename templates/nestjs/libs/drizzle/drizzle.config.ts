import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/libs/drizzle/db/schemas/*.schema.ts",
	out: "./src/libs/drizzle/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
})
