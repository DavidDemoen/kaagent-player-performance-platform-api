import { ne } from 'drizzle-orm';
import { jsonb } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

// TODO: check if status can be exported to an enum
// best case -> to shared types
//export type evaluationStatus = "draft" | "submitted"

export const evaluationsTable = pgTable(
  'evaluations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id').notNull(),
    authorId: uuid('author_id').notNull(),

    // Everything else is stored in the metadata of the evaluation JSONB
    dataObject: jsonb('data_objects').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    // templateVersion: varchar('template_version', { length: 50 }).notNull().references(() => ),
    submittedAt: timestamp('submitted_at').notNull().default(new Date(0)),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index('evaluations_player_id_idx').on(table.playerId),
    index('evaluations_author_id_idx').on(table.authorId),
  ],
);
