import { integer, numeric, pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

// Incomes table definition
export const Incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull(),
  from: varchar('from'),
  icon: varchar('icon'),
  createdBy: varchar('createdBy').notNull(),
});

// Budgets table definition
export const Budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull(),
  incomeId: integer('incomeId').references(() => Incomes.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
  icon: varchar('icon'),
  from: varchar('from'),
  createdBy: varchar('createdBy').notNull()
});

// Expenses table definition
export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  amount: numeric('amount').notNull().default(0),
  budgetId: integer('budgetId').references(() => Budgets.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
  createdAt:varchar('createdAt').notNull(),
});
