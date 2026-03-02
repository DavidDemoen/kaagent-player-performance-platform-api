import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { EvaluationsController } from './controllers/evaluations.controller';
import { EvaluationsService } from './services/evaluations.service';
import { PlayerEvaluationsTemplateService } from './services/evaluation-template.service';
import { EvaluationsRepository } from './repositories/evaluations.repository';
import { EvaluationsTemplateRepository } from './repositories/evaluation-templates.repository';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [EvaluationsController],
  providers: [
    // Services
    EvaluationsService,
    PlayerEvaluationsTemplateService,
    // Repositories
    EvaluationsRepository,
    EvaluationsTemplateRepository,
  ],
})
export class PlayersEvaluationsModule {}
