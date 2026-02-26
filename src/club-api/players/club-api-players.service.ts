import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/club-database/schema';
import { tryCatch } from 'lib/utils/error/try-catch';
import { eq } from 'drizzle-orm';
import { APIError } from 'better-auth';
import { PlayerSelect } from 'src/club-data/dto';

@Injectable()
export class ClubApiPlayersService {
  private readonly logger = new Logger(ClubApiPlayersService.name);

  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllPlayers(): Promise<PlayerSelect[] | APIError> {
    const { data: players, error } = await tryCatch(
      this.db.query.playersTable.findMany(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return players;
  }

  async getPlayerById(id: string): Promise<PlayerSelect | APIError> {
    const { data: player, error } = await tryCatch(
      this.db.query.playersTable.findFirst({
        where: eq(schema.playersTable.id, id),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    if (!player) {
      return new APIError(404, {
        cause: error,
        message: `No player found with id: ${id}`,
      });
    }
    return player;
  }
}
