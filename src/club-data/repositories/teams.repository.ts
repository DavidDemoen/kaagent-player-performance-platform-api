import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import { OpteamalTeamDto, TeamDto, TeamInsert } from '../dto';
import * as schema from 'databases/club-database/schema';
import { tryCatch } from 'lib/utils/error/try-catch';
import { APIError } from 'better-auth';
import { eq } from 'drizzle-orm';

@Injectable()
export class TeamsRepository {
  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(): Promise<TeamDto[] | APIError> {
    const { data, error } = await tryCatch(this.db.query.teamsTable.findMany());

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    if (!data) {
      return new APIError(404, {
        message: 'No teams found',
      });
    }

    return data;
  }

  async findByOpteamalKey(key: string): Promise<TeamDto | APIError> {
    const { data, error } = await tryCatch(
      this.db.query.teamsTable.findFirst({
        where: eq(schema.teamsTable.opteamalKey, key),
      }),
    );

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    if (!data) {
      return new APIError(404, {
        message: `No team found with key: ${key}`,
      });
    }

    return data;
  }

  async findByKey(key: string): Promise<TeamDto | APIError> {
    const { data, error } = await tryCatch(
      this.db.query.teamsTable.findFirst({
        where: eq(schema.teamsTable.teamKey, key),
      }),
    );

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    if (!data) {
      return new APIError(404, {
        message: `No team found with key: ${key}`,
      });
    }

    return data;
  }

  async create(teamData: TeamInsert): Promise<TeamDto | APIError> {
    const { data, error } = await tryCatch(
      this.db.insert(schema.teamsTable).values(teamData).returning(),
    );

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    return data[0];
  }

  async update(
    teamKey: string,
    teamData: Partial<TeamInsert>,
  ): Promise<TeamDto | APIError> {
    const { data, error } = await tryCatch(
      this.db
        .update(schema.teamsTable)
        .set(teamData)
        .where(eq(schema.teamsTable.teamKey, teamKey))
        .returning(),
    );

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    if (data.length === 0) {
      return new APIError(404, {
        message: `No team found with key: ${teamKey}`,
      });
    }

    return data[0];
  }

  async upsertBatch(teams: TeamInsert[]): Promise<void | APIError> {
    for (const team of teams) {
      const response = await this.findByOpteamalKey(team.opteamalKey);
      if (response instanceof Error && response.statusCode === 404) {
        const createResponse = await this.create({
          opteamalKey: team.opteamalKey,
          name: team.name,
        });
        if (createResponse instanceof Error) {
          return createResponse;
        }
        continue;
      }
      if (response instanceof Error) {
        return response;
      }

      await this.update(response.teamKey, team);
    }
  }
}
