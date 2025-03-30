
import { serial, text, varchar, pgTable } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon', { length: 255 }),
    createdBy: varchar('created_by', { length: 255 }).notNull()
})