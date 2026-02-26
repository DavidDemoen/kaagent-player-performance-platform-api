import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/club-database/schema';
import { PlayersTeamsHistoryInsert } from '../dto';
import { APIError } from 'better-auth';
import { tryCatch } from 'lib/utils/error/try-catch';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class PlayersTeamsHistoryRepository {
  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async upsertTeamHistory({
    playerId,
    teamKey,
    isCurrent,
    isPrimaryTeam,
  }: PlayersTeamsHistoryInsert): Promise<void | APIError> {
    const { error: deleteError } = await tryCatch(
      this.db
        .delete(schema.playersTeamsHistoryTable)
        .where(
          and(
            eq(schema.playersTeamsHistoryTable.playerId, playerId),
            eq(schema.playersTeamsHistoryTable.teamKey, teamKey),
          ),
        ),
    );

    if (deleteError) {
      return new APIError(500, {
        cause: deleteError,
        statusCode: 500,
        message: `Failed to delete existing team history for playerId ${playerId} and teamKey ${teamKey}: ${deleteError.message}`,
      });
    }

    const { error: insertError } = await tryCatch(
      this.db.insert(schema.playersTeamsHistoryTable).values({
        playerId,
        teamKey,
        isCurrent,
        isPrimaryTeam,
      }),
    );

    if (insertError) {
      return new APIError(500, {
        cause: insertError,
        statusCode: 500,
        message: `Failed to insert team history for playerId ${playerId} and teamKey ${teamKey}: ${insertError.message}`,
      });
    }
  }
}
