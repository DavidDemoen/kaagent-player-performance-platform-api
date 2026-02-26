import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'databases/club-database/schema';
import { club_database_connection } from 'src/database/database-connections';
import { tryCatch } from 'lib/utils/error/try-catch';
import { APIError } from 'better-auth';
import { TeamSelect } from 'src/club-data/dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ClubApiTeamsService {
  private readonly logger = new Logger(ClubApiTeamsService.name);

  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllTeams(): Promise<TeamSelect[] | APIError> {
    const { data: teams, error } = await tryCatch(
      this.db.query.teamsTable.findMany(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return teams;
  }
  async getTeamByKey(teamKey: string) {
    const { data: team, error } = await tryCatch(
      this.db.query.teamsTable.findFirst({
        where: eq(schema.teamsTable.teamKey, teamKey),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    if (!team) {
      return new APIError(404, {
        cause: error,
        message: `No team found with key: ${teamKey}`,
      });
    }
    return team;
  }

  async getTeamByOpteamalKeyWithPlayerHist(opteamalKey: string) {
    const { data: team, error } = await tryCatch(
      this.db.query.teamsTable.findFirst({
        where: eq(schema.teamsTable.opteamalKey, opteamalKey),
        with: {
          playersHist: {
            with: {
              player: {
                with: {
                  positionsHist: true,
                },
              },
            },
          },
        },
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    if (!team) {
      return new APIError(404, {
        cause: error,
        message: `No team found with opteamal key: ${opteamalKey}`,
      });
    }
    return team;
  }
}
