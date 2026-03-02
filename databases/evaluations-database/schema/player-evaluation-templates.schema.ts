import { timestamp } from 'drizzle-orm/pg-core';
import { boolean, jsonb } from 'drizzle-orm/pg-core';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const playerEvaluationTemplatesTable = pgTable('evaluation_templates', {
  name: varchar('name', { length: 255 }).primaryKey(),
  version: varchar('version', { length: 50 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  schema: jsonb('schema').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdateFn(() => new Date()),
});
