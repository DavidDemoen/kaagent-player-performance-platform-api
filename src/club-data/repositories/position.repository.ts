import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/club-database/schema';
import { APIError } from 'better-auth';
import { tryCatch } from 'lib/utils/error/try-catch';
import { PlayerPositionInsert, PlayerPositionSelect } from '../dto';

@Injectable()
export class PositionsRepository {
  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getOrCreatePositions(
    positionNames: string[],
  ): Promise<string[] | APIError> {
    if (!positionNames || positionNames.length === 0) {
      return [];
    }

    // Remove duplicates
    const uniquePositions = [...new Set(positionNames)];

    // Try to insert all (duplicates ignored by DB constraint)
    const { error: insertError } = await tryCatch(
      this.db
        .insert(schema.playerPositionsTable)
        .values(uniquePositions.map((name) => ({ name })))
        .onConflictDoNothing(), // Ignore if already exists
    );

    if (insertError) {
      return new APIError(500, {
        cause: insertError,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to create positions: ${insertError.message}`,
      });
    }

    return uniquePositions;
  }

  async createPosition(
    position: PlayerPositionInsert,
  ): Promise<PlayerPositionSelect | APIError> {
    const { data, error: insertError } = await tryCatch(
      this.db
        .insert(schema.playerPositionsTable)
        .values({ name: position.name })
        .returning(),
    );

    if (insertError) {
      return new APIError(500, {
        cause: insertError,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to create position ${position.name}: ${insertError.message}`,
      });
    }

    return data[0];
  }
}
