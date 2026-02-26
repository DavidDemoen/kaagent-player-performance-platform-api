import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './databases/club-database/schema.ts',
  out: './databases/club-database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.CLUB_DATABASE_URL!,
  },
});