import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core"

export const __domain__Table = pgTable("__domain__", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})
