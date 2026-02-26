import { playersTable } from 'databases/club-database/schema';
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type PlayerSelect = InferSelectModel<typeof playersTable>;
export type PlayerInsert = InferInsertModel<typeof playersTable>;
export type PlayerDto = PlayerSelect;

export type PlayerUpsertObject = {
  player: PlayerInsert;
  teamHistoryObject: {
    opteamalTeamKey: string;
    opteamalPlayerId: string;
    isCurrent: boolean;
    isPrimaryTeam: boolean;
  } | null;
  positionsHistoryObjects:
    | {
        opteamalPlayerId: string;
        positionName: string;
        isCurrent: boolean;
        validFromDt: Date;
        validToDt: Date | null;
      }[]
    | null;
};
