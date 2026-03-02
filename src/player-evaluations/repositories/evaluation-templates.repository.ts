import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { evaluations_database_connection } from 'src/database/database-connections';
import * as schema from 'databases/evaluations-database/schema';
import {
  PlayerEvaluationTemplateDto,
  PlayerEvaluationTemplateInsert,
} from '../dto';
import { APIError } from 'better-auth';
import { eq } from 'drizzle-orm';
import { tryCatch } from 'lib/utils/error/try-catch';

@Injectable()
export class EvaluationsTemplateRepository {
  constructor(
    @Inject(evaluations_database_connection)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getAllActiveTemplates(): Promise<
    PlayerEvaluationTemplateDto[] | APIError
  > {
    const { data: templates, error } = await tryCatch(
      this.db.query.playerEvaluationTemplatesTable.findMany({
        where: eq(schema.playerEvaluationTemplatesTable.isActive, true),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return templates;
  }

  async getTemplateByName(
    name: string,
  ): Promise<PlayerEvaluationTemplateDto | APIError> {
    const { data: template, error } = await tryCatch(
      this.db.query.playerEvaluationTemplatesTable.findFirst({
        where: eq(schema.playerEvaluationTemplatesTable.name, name),
      }),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    if (!template) {
      return new APIError(404, {
        message: `Player evaluation template with name ${name} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return template;
  }

  async createTemplate(
    template: PlayerEvaluationTemplateInsert,
  ): Promise<PlayerEvaluationTemplateDto | APIError> {
    const { data: createdTemplate, error } = await tryCatch(
      this.db
        .insert(schema.playerEvaluationTemplatesTable)
        .values(template)
        .returning(),
    );
    if (error) {
      return new APIError(500, {
        cause: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      });
    }
    return createdTemplate[0];
  }
}
