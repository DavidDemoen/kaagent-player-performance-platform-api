import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { playersPositionsHistoryTable } from './players-positions-history.schema';

export const playerPositionsTable = pgTable('player_positions', {
  name: varchar('name', { length: 255 }).primaryKey(),
});

export const playerPositionRelations = relations(
  playerPositionsTable,
  ({ many }) => ({
    playersHist: many(playersPositionsHistoryTable),
  }),
);
