import { varchar } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { playersTeamsHistoryTable } from './players-teams-history.schema';
import { relations } from 'drizzle-orm';

export const teamsTable = pgTable(
  'teams',
  {
    teamKey: uuid('team_key').primaryKey().defaultRandom(),
    opteamalKey: varchar('opteamal_key', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }).notNull(),
  },
  (t) => [
    index('teams_name_idx').on(t.name),
    index('teams_opteamal_key_idx').on(t.opteamalKey),
  ],
);

export const teamsRelations = relations(teamsTable, ({ many }) => ({
  playersHist: many(playersTeamsHistoryTable),
}));
