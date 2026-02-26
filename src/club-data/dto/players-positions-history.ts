import { playersPositionsHistoryTable } from 'databases/club-database/schema';
import { InferSelectModel } from 'drizzle-orm';

export type PlayersPositionsHistSelect = InferSelectModel<
  typeof playersPositionsHistoryTable
>;
export type PlayersPositionsHistInsert = InferSelectModel<
  typeof playersPositionsHistoryTable
>;
export type PlayersPositionsHistoryDto = PlayersPositionsHistSelect;
