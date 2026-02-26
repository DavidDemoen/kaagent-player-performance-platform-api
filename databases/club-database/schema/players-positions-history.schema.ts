import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { playersTable } from './players.schema';
import { playerPositionsTable } from './player-positions.schema';
import { primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const playersPositionsHistoryTable = pgTable(
  'players_positions_history',
  {
    playerId: uuid('player_id')
      .notNull()
      .references(() => playersTable.id, { onDelete: 'cascade' }),
    positionName: varchar('position_name', { length: 255 })
      .notNull()
      .references(() => playerPositionsTable.name, { onDelete: 'cascade' }),
    isCurrent: boolean('is_current').notNull(),
    validFromDt: timestamp('valid_from_dt').notNull(),
    validToDt: timestamp('valid_to_dt'),
  },
  (t) => [
    primaryKey({
      name: 'players_positions_history_pkey',
      columns: [t.playerId, t.positionName],
    }),
  ],
);

export const playersPositionsHistoryRelations = relations(
  playersPositionsHistoryTable,
  ({ one }) => ({
    player: one(playersTable, {
      fields: [playersPositionsHistoryTable.playerId],
      references: [playersTable.id],
    }),
    position: one(playerPositionsTable, {
      fields: [playersPositionsHistoryTable.positionName],
      references: [playerPositionsTable.name],
    }),
  }),
);
