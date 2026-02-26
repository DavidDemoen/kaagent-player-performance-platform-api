import { teamsTable } from "databases/club-database/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";


export type TeamSelect = InferSelectModel<typeof teamsTable>
export type TeamInsert = InferInsertModel<typeof teamsTable>
export type TeamDto = TeamSelect;