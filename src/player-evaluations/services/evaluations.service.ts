import { Injectable } from '@nestjs/common';
import { EvaluationsRepository } from '../repositories/evaluations.repository';
import { EvaluationDto, EvaluationInsert } from '../dto/evaluations.dto';
import { APIError } from 'better-auth';

@Injectable()
export class EvaluationsService {
  constructor(private readonly evaluationRepo: EvaluationsRepository) {}

  async getAllEvaluations(): Promise<EvaluationDto[] | APIError> {
    return await this.evaluationRepo.getAllEvaluations();
  }

  async getAllEvaluationsForPlayer(
    playerId: string,
  ): Promise<EvaluationDto[] | APIError> {
    return await this.evaluationRepo.getAllEvaluationsForPlayer(playerId);
  }

  async getAllEvaluationsFromAuthor(
    authorId: string,
  ): Promise<EvaluationDto[] | APIError> {
    return await this.evaluationRepo.getAllEvaluationsFromAuthor(authorId);
  }

  async getEvaluationById(
    evaluationId: string,
  ): Promise<EvaluationDto | APIError> {
    return await this.evaluationRepo.getEvaluationById(evaluationId);
  }

  async createEvaluation(
    evaluationData: EvaluationInsert,
  ): Promise<EvaluationDto | APIError> {
    // TODO: implement validation and authorization logic here
    return await this.evaluationRepo.createEvaluation(evaluationData);
  }
}
