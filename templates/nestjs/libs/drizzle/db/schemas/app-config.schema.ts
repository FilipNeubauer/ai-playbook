import { pgTable, pgEnum, varchar } from "drizzle-orm/pg-core"

export const appConfigKeyEnum = pgEnum("app_config_key", [
	"app_force_update_enabled",
	"app_min_version_ios",
	"app_min_version_android",
	"app_store_url_ios",
	"app_store_url_android",
])

export const appConfigTable = pgTable("app_config", {
	key: appConfigKeyEnum("key").primaryKey(),
	value: varchar("value", { length: 500 }).notNull(),
})
