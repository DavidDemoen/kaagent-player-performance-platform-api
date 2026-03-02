import { relations } from 'drizzle-orm';
import { date, numeric } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { timestamp } from 'drizzle-orm/pg-core';
import { uuid, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { playersTeamsHistoryTable } from './players-teams-history.schema';
import { playersPositionsHistoryTable } from './players-positions-history.schema';
import { integer } from 'drizzle-orm/pg-core';

export const playersTable = pgTable(
  'players',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    opteamalId: uuid('opteamal-id').notNull().unique(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    birthDate: date('birth_date').notNull(),
    gender: varchar('gender', { length: 255 }).notNull(),
    shirtNumber: integer('shirt_number').notNull().default(-1),
    nationality: varchar('nationality', { length: 255 }).notNull(),
    secondNationality: varchar('second_nationality', { length: 255 }),
    createdAt: timestamp('created_at').notNull(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (t) => [
    index('players_full_name_idx').on(t.firstName, t.lastName),
    index('players_opteamal_id_idx').on(t.opteamalId),
    index('players_slug_idx').on(t.slug),
  ],
);
export const playersRelations = relations(playersTable, ({ many }) => ({
  teamsHist: many(playersTeamsHistoryTable),
  positionsHist: many(playersPositionsHistoryTable),
}));
