import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  club_database_connection,
  evaluations_database_connection,
} from './database-connections';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as clubSchema from '../../databases/club-database/schema';
import * as evaluationsSchema from '../../databases/evaluations-database/schema';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: club_database_connection,
      useFactory: (configSevice: ConfigService) => {
        const pool = new Pool({
          connectionString: configSevice.getOrThrow('CLUB_DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: {
            ...clubSchema,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: evaluations_database_connection,
      useFactory: (configSevice: ConfigService) => {
        const pool = new Pool({
          connectionString: configSevice.getOrThrow('EVALUATIONS_DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: {
            ...evaluationsSchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [club_database_connection, evaluations_database_connection],
})
export class DatabaseModule {}
