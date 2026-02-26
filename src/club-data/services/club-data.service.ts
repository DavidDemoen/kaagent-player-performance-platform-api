import { Injectable, Logger } from '@nestjs/common';
import { OpteamalApiClientFactory } from '../clients/opteamal-api.factory';
import { APIError } from 'better-auth';
import { PlayerSyncOrchestrator } from './player-sync.orchestrator';
import { TeamsSyncOrchestrator } from './teams-sync.orchestrator';

@Injectable()
export class ClubDataService {
  private readonly logger = new Logger(ClubDataService.name);

  constructor(
    private readonly opteamlClientFactory: OpteamalApiClientFactory,
    private readonly teamsSyncOrchestrator: TeamsSyncOrchestrator,
    private readonly playerSyncOrchestrator: PlayerSyncOrchestrator,
  ) {}

  async syncClubData(): Promise<void | APIError> {
    this.logger.log('Starting club data synchronization');

    const opteamalClient = this.opteamlClientFactory.createClient();

    const teamsData = await opteamalClient.fetchTeamsData();
    if (teamsData instanceof Error) {
      return teamsData;
    }

    const playersData = await opteamalClient.fetchPlayersData();

    if (playersData instanceof Error) {
      return playersData;
    }

    this.logger.log('Syncing teams...');
    // TODO: connect with teams orchestrator
    const teamsSyncError =
      await this.teamsSyncOrchestrator.syncTeams(teamsData);
    if (teamsSyncError instanceof Error) {
      this.logger.error('Error syncing teams data', teamsSyncError);
      return teamsSyncError;
    }

    this.logger.log('Syncing players...');
    const playersSyncError =
      await this.playerSyncOrchestrator.syncPlayers(playersData);
    if (playersSyncError instanceof Error) {
      this.logger.error('Error syncing players data', playersSyncError);
      return playersSyncError;
    }
  }
}
