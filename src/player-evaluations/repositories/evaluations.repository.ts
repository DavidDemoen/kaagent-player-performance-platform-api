import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { evaluations_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/evaluations-database/schema';
import { tryCatch } from 'lib/utils/error/try-catch';
import { evaluationsTable } from 'databases/evaluations-database/schema/evaluations.schema';
import { eq } from 'drizzle-orm';
import { APIError } from 'better-auth';
import { EvaluationInsert, EvaluationSelect } from '../dto/evaluations.dto';

@Injectable()
export class EvaluationsRepository {
  constructor(
    @Inject(evaluations_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllEvaluations(): Promise<EvaluationSelect[] | APIError> {
    const { data: evaluations, error } = await tryCatch(
      this.db.query.evaluationsTable.findMany(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return evaluations;
  }

  async getAllEvaluationsForPlayer(
    playerId: string,
  ): Promise<EvaluationSelect[] | APIError> {
    const { data: evaluations, error } = await tryCatch(
      this.db.query.evaluationsTable.findMany({
        where: eq(evaluationsTable.playerId, playerId),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return evaluations;
  }

  async getAllEvaluationsFromAuthor(
    authorId: string,
  ): Promise<EvaluationSelect[] | APIError> {
    const { data: evaluations, error } = await tryCatch(
      this.db.query.evaluationsTable.findMany({
        where: eq(evaluationsTable.authorId, authorId),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return evaluations;
  }

  async getEvaluationById(id: string): Promise<EvaluationSelect | APIError> {
    const { data: evaluation, error } = await tryCatch(
      this.db.query.evaluationsTable.findFirst({
        where: eq(evaluationsTable.id, id),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    if (!evaluation) {
      return new APIError(404, {
        message: `Player evaluation  with id ${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return evaluation;
  }

  async createEvaluation(
    evaluation: EvaluationInsert,
  ): Promise<EvaluationSelect | APIError> {
    const { data: createdEvaluation, error } = await tryCatch(
      this.db.insert(evaluationsTable).values(evaluation).returning(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return createdEvaluation[0];
  }
}
