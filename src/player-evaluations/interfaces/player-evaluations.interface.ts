import {
  PlayerEvaluationInsert,
  PlayerEvaluationSelect,
  PlayerEvaluationStatus,
  PlayerEvaluationTemplateSelect,
  PlayerEvaluationType,
} from 'kaagent-player-performance-platform-shared-types';

export interface IPlauyerEvaluationsRepository {
  findById(id: string): Promise<PlayerEvaluationSelect | null>;

  findDraftInPeriod(
    playerId: string,
    evaluationType: PlayerEvaluationType,
    startDate: Date,
    endDate: Date,
  ): Promise<PlayerEvaluationSelect[] | null>;

  create(
    playerEvaluation: PlayerEvaluationInsert,
  ): Promise<PlayerEvaluationSelect>;

  updateEvaluationData(
    id: string,
    evaluationData: Record<string, any>,
  ): Promise<PlayerEvaluationSelect>;

  updateStatus(
    id: string,
    status: PlayerEvaluationStatus,
    submittedAt?: Date,
  ): Promise<PlayerEvaluationSelect>;

  countByPeriod(
    playerId: string,
    evaluationType: PlayerEvaluationType,
    startDate: Date,
    endDate: Date,
    statusFilter?: PlayerEvaluationStatus[],
  ): Promise<number>;
}

export interface IPlayerEvaluationsTemplateRepository {
  findActive(
    evaluationType: string,
  ): Promise<PlayerEvaluationTemplateSelect | null>;
  findById(id: string): Promise<PlayerEvaluationTemplateSelect | null>;
  findAll(): Promise<PlayerEvaluationTemplateSelect[]>;
}
