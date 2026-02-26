import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import { ClubApiPlayersService } from '../players/club-api-players.service';
import * as schema from 'databases/club-database/schema';
import { tryCatch } from 'lib/utils/error/try-catch';
import { APIError } from 'better-auth';
import { PlayerPositionDto } from 'src/club-data/dto';

@Injectable()
export class ClubApiPositionsService {
  private readonly logger = new Logger(ClubApiPlayersService.name);

  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllPositions(): Promise<PlayerPositionDto[] | APIError> {
    const { data: positions, error } = await tryCatch(
      this.db.query.playerPositionsTable.findMany(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return positions;
  }
}
