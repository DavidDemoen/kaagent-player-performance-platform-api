import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/club-database/schema';
import { APIError } from 'better-auth';
import { and, eq } from 'drizzle-orm';
import { tryCatch } from 'lib/utils/error/try-catch';
import { PlayersPositionsHistInsert } from '../dto';

@Injectable()
export class PlayersPositionsHistoryRepository {
  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async upsertPositionsHistory({
    playerId,
    positionName,
    isCurrent,
    validFromDt,
    validToDt,
  }: PlayersPositionsHistInsert): Promise<void | APIError> {
    const { error: deleteError } = await tryCatch(
      this.db
        .delete(schema.playersPositionsHistoryTable)
        .where(
          and(
            eq(schema.playersPositionsHistoryTable.playerId, playerId),
            eq(schema.playersPositionsHistoryTable.positionName, positionName),
          ),
        ),
    );

    if (deleteError) {
      return new APIError(500, {
        cause: deleteError,
        statusCode: 500,
        message: `Failed to delete existing position history for playerId ${playerId} and positionName ${positionName}: ${deleteError.message}`,
      });
    }

    const { error: insertError } = await tryCatch(
      this.db.insert(schema.playersPositionsHistoryTable).values({
        playerId,
        positionName,
        isCurrent,
        validFromDt,
        validToDt,
      }),
    );

    if (insertError) {
      return new APIError(500, {
        cause: insertError,
        statusCode: 500,
        message: `Failed to insert position history for playerId ${playerId} and positionName ${positionName}: ${insertError.message}`,
      });
    }
  }
}
