import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APP_GUARD } from '@nestjs/core';
import { nextCookies } from 'better-auth/next-js';
import { ClubDataModule } from './club-data/club-data.module';
import { club_database_connection } from './database/database-connections';
import { ScheduleModule } from '@nestjs/schedule';
import { ClubApiModule } from './club-api/club-data-api.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configSerice: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          baseURL: configSerice.getOrThrow('BETTER_AUTH_BASE_URL'),
          trustedOrigins: [configSerice.getOrThrow('WEB_BASE_URL')],
          plugins: [nextCookies()],
        }),
      }),
      inject: [club_database_connection, ConfigService],
    }),
    ClubDataModule,
    ClubApiModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
