import {
  pgTable,
  uuid,
  jsonb,
  varchar,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { evaluationTemplatesTable } from '../schema';
import { relations } from 'drizzle-orm';

export const evaluationsTable = pgTable(
  'evaluations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id').notNull(),
    coachIds: jsonb('coach_ids').notNull(),
    evaluationTemplateId: uuid('evaluation_template_id')
      .notNull()
      .references(() => evaluationTemplatesTable.id),
    evaluationData: jsonb('evaluation_data').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('draft'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    submittedAt: timestamp('submitted_at'),
  },
  (t) => [
    index('evaluations_player_id_idx').on(t.playerId),
    index('evaluations_evaluation_template_id_idx').on(t.evaluationTemplateId),
  ],
);

export const evaluationsRelations = relations(evaluationsTable, ({ one }) => ({
  evaluationTemplate: one(evaluationTemplatesTable, {
    fields: [evaluationsTable.evaluationTemplateId],
    references: [evaluationTemplatesTable.id],
  }),
}));
