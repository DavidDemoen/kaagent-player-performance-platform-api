import { playerPositionsTable } from 'databases/club-database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type PlayerPositionSelect = InferSelectModel<
  typeof playerPositionsTable
>;
export type PlayerPositionInsert = InferInsertModel<
  typeof playerPositionsTable
>;
export type PlayerPositionDto = PlayerPositionInsert;
