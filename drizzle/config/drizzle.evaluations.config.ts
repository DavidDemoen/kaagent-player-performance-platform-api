import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './databases/evaluations-database/schema.ts',
  out: './databases/evaluations-database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.EVALUATIONS_DATABASE_URL!,
  },
});
