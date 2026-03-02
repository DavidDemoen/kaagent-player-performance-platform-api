import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvaluationsService } from '../services/evaluations.service';
import type { EvaluationInsert } from '../dto/evaluations.dto';

@Controller('player-evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationService: EvaluationsService) {}

  @Get()
  async getAllEvaluations() {
    return this.evaluationService.getAllEvaluations();
  }

  @Get('player/:playerId')
  async getAllEvaluationsForPlayer(@Param('playerId') playerId: string) {
    return this.evaluationService.getAllEvaluationsForPlayer(playerId);
  }

  @Get('author/:authorId')
  async getAllEvaluationsFromAuthor(@Param('authorId') authorId: string) {
    return this.evaluationService.getAllEvaluationsFromAuthor(authorId);
  }

  @Get(':id')
  async getEvaluationById(@Param('id') id: string) {
    return this.evaluationService.getEvaluationById(id);
  }

  @Post()
  async createEvaluation(@Body() evaluationData: EvaluationInsert) {
    return this.evaluationService.createEvaluation(evaluationData);
  }
}
