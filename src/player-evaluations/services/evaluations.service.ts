import { Injectable } from '@nestjs/common';
import { EvaluationsRepository } from '../repositories/evaluations.repository';

@Injectable()
export class EvaluationService {
  constructor(private readonly evaluationRepo: EvaluationsRepository) {}
}
