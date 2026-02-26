import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OpteamalApiClientFactory } from './clients/opteamal-api.factory';
import { PlayersRepository } from './repositories/player.repository';
import { PlayersPositionsHistoryRepository } from './repositories/players-positions-history.repository';
import { PlayersTeamsHistoryRepository } from './repositories/players-teams-history.repository';
import { PositionsRepository } from './repositories/position.repository';
import { TeamsRepository } from './repositories/teams.repository';
import { PlayerSyncOrchestrator } from './services/player-sync.orchestrator';
import { TeamsSyncOrchestrator } from './services/teams-sync.orchestrator';
import { ClubDataScheduler } from './services/club-data.scheduler';
import { ClubDataService } from './services/club-data.service';
import { ClubDataController } from './club-data.controller';
import { ConfigModule } from '@nestjs/config';
import { MockOpteamalApiClient } from './clients/mock-opteamal-api.client';
import { HttpModule } from '@nestjs/axios';
import { OpteamalApiClient } from './clients/opteamal-api.client';

@Module({
  imports: [DatabaseModule, ConfigModule, HttpModule],
  controllers: [ClubDataController],
  providers: [
    // Repositories
    TeamsRepository,
    PlayersRepository,
    PlayersTeamsHistoryRepository,
    PlayersPositionsHistoryRepository,
    PositionsRepository,
    // Services
    PlayerSyncOrchestrator,
    TeamsSyncOrchestrator,
    ClubDataService,
    ClubDataScheduler,
    // Clients
    OpteamalApiClientFactory,
    MockOpteamalApiClient,
    OpteamalApiClient,
  ],
})
export class ClubDataModule {}
