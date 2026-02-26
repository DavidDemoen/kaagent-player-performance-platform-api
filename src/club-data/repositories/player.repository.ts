import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { club_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/club-database/schema';
import { PlayerDto, PlayerInsert, PlayerUpsertObject } from '../dto';
import { APIError } from 'better-auth';
import { tryCatch } from 'lib/utils/error/try-catch';
import { eq } from 'drizzle-orm';

@Injectable()
export class PlayersRepository {
  constructor(
    @Inject(club_database_connection)
    private readonly db: NodePgDatabase<typeof schema>, // Replace 'any' with the actual type of your database connection
  ) {}

  async findAll(): Promise<PlayerDto[] | APIError> {
    const { data, error } = await tryCatch(
      this.db.query.playersTable.findMany(),
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
        message: 'No teams found',
      });
    }

    return data;
  }

  async findByOpteamalId(id: string): Promise<PlayerDto | APIError> {
    const { data, error } = await tryCatch(
      this.db.query.playersTable.findFirst({
        where: eq(schema.playersTable.opteamalId, id),
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
        message: `No team found with opteamal id: ${id}`,
      });
    }

    return data;
  }

  async findById(id: string): Promise<PlayerDto | APIError> {
    const { data, error } = await tryCatch(
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

    if (!data) {
      return new APIError(404, {
        message: `No team found with internal id: ${id}`,
      });
    }

    return data;
  }

  async create(player: PlayerInsert): Promise<PlayerDto | APIError> {
    const { data, error } = await tryCatch(
      this.db.insert(schema.playersTable).values(player).returning(),
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
    id: string,
    playerData: Partial<PlayerInsert>,
  ): Promise<PlayerDto | APIError> {
    const { data, error } = await tryCatch(
      this.db
        .update(schema.playersTable)
        .set(playerData)
        .where(eq(schema.playersTable.id, id))
        .returning(),
    );

    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      return new APIError(404, {
        message: `No team found with id: ${id}`,
      });
    }

    return data[0];
  }

  async upsertPlayer(player: PlayerInsert): Promise<PlayerDto | APIError> {
    const fetchResponse = await this.findByOpteamalId(player.opteamalId);

    if (fetchResponse instanceof Error && fetchResponse.statusCode === 404) {
      // Player not found, create a new one
      return this.create(player);
    }

    if (fetchResponse instanceof Error) {
      // An error occurred while fetching the player
      return fetchResponse;
    }

    // Player exists, update it
    return this.update(fetchResponse.id, player);
  }
}
