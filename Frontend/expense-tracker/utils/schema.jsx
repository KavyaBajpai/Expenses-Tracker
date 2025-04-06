
import { serial, numeric, varchar, pgTable, integer } from "drizzle-orm/pg-core";

export const Budgets = pgTable('budgets', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    amount: varchar('amount').notNull(),
    icon: varchar('icon', { length: 255 }),
    createdBy: varchar('created_by', { length: 255 }).notNull()
})

export const Expenses = pgTable('expenses', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    amount: varchar(numeric('amount')).notNull(),
    createdAt: varchar('createdAt').notNull(),
    
    budgetId: integer('budgetId').references(()=> Budgets.id)
})