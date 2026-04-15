import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core"

export const refreshTokenTable = pgTable("refresh_token", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").notNull(),
	tokenHash: varchar("token_hash", { length: 500 }).notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
})
