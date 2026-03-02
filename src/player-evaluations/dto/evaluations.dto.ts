import { evaluationsTable } from 'databases/evaluations-database/schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type EvaluationSelect = InferSelectModel<typeof evaluationsTable>;
export type EvaluationDto = EvaluationSelect;
export type EvaluationInsert = InferInsertModel<typeof evaluationsTable>;
export type EvaluationUpdate = Partial<EvaluationInsert> & { id: string };
