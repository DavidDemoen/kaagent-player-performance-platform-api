import { boolean, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { playersTable } from './players.schema';
import { teamsTable } from './teams.schema';
import { relations } from 'drizzle-orm';

export const playersTeamsHistoryTable = pgTable(
  'players_teams_history',
  {
    playerId: uuid('player_id')
      .notNull()
      .references(() => playersTable.id, { onDelete: 'cascade' }),
    teamKey: uuid('team_key')
      .notNull()
      .references(() => teamsTable.teamKey, { onDelete: 'cascade' }),
    isCurrent: boolean('is_current').notNull(),
    isPrimaryTeam: boolean('is_primary_team').notNull(),
  },
  (t) => [
    primaryKey({
      name: 'players_teams_history_pkey',
      columns: [t.playerId, t.teamKey],
    }),
  ],
);

export const playersTeamsHistoryRelations = relations(
  playersTeamsHistoryTable,
  ({ one }) => ({
    player: one(playersTable, {
      fields: [playersTeamsHistoryTable.playerId],
      references: [playersTable.id],
    }),
    team: one(teamsTable, {
      fields: [playersTeamsHistoryTable.teamKey],
      references: [teamsTable.teamKey],
    }),
  }),
);
