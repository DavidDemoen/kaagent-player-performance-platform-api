import { Injectable } from '@nestjs/common';
import { PlayerEvaluationTemplateInsert } from '../dto';
import { EvaluationsTemplateRepository } from '../repositories/evaluation-templates.repository';

@Injectable()
export class PlayerEvaluationsTemplateService {
  constructor(
    private readonly templateRepo: EvaluationsTemplateRepository,
  ) {}

  async getAllActiveTemplates() {
    return this.templateRepo.getAllActiveTemplates();
  }

  async getTemplateByName(name: string) {
    return this.templateRepo.getTemplateByName(name);
  }

  async createTemplate(template: PlayerEvaluationTemplateInsert) {
    return this.templateRepo.createTemplate(template);
  }
}
