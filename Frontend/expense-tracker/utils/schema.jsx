
import { serial, numeric, varchar, pgTable, integer, timestamp } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon', { length: 255 }),
    createdBy: varchar('created_by', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull() 
})

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar(numeric('amount')).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    budgetId: integer('budget_id').references(()=> Budgets.id),
    createdBy: varchar('created_by').notNull()
})