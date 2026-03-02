import { playerEvaluationTemplatesTable } from 'databases/evaluations-database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// TODO: move to shared module if needed in other places
export type PlayerEvaluationTemplateSelect = InferSelectModel<
  typeof playerEvaluationTemplatesTable
>;
export type PlayerEvaluationTemplateDto = PlayerEvaluationTemplateSelect;
export type PlayerEvaluationTemplateInsert = InferInsertModel<
  typeof playerEvaluationTemplatesTable
>;
export type PlayerEvaluationTemplateUpdate =
  Partial<PlayerEvaluationTemplateInsert> & { name: string };
