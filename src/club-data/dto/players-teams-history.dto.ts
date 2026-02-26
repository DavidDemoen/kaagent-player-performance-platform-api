import { playersTeamsHistoryTable } from "databases/club-database/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";


export type PlayersTeamsHistorySelect = InferSelectModel<typeof playersTeamsHistoryTable>
export type PlayersTeamsHistoryInsert = InferInsertModel<typeof playersTeamsHistoryTable>
export type PlayersTeamsHistoryDto = PlayersTeamsHistorySelect;