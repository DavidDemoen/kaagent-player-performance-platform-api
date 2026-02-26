import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClubDataService } from './club-data.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ClubDataScheduler implements OnModuleInit {
  private readonly logger = new Logger(ClubDataScheduler.name);
  private syncAtStartUp: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly clubDataService: ClubDataService,
  ) {
    this.syncAtStartUp =
      this.configService
        .get('OPTEAMAL_SYNC_AT_STARTUP', 'false')
        .toLowerCase() === 'true';
  }

  async onModuleInit(): Promise<void> {
    if (this.syncAtStartUp) {
      this.logger.log('Running club data sync on startup...');
      const error = await this.clubDataService.syncClubData();
      if (error) {
        this.logger.error('Startup sync failed', error);
      } else {
        this.logger.log('Startup sync completed successfully');
      }
    } else {
      this.logger.log(
        'Skipping startup sync to avoid API overload. Next sync at scheduled time.',
      );
    }
  }

  // TODO: add env config to control schedule frequency
  @Cron(CronExpression.EVERY_HOUR)
  async syncClubDataScheduled(): Promise<void> {
    this.logger.log('Running scheduled club data sync...');
    const error = await this.clubDataService.syncClubData();
    if (error) {
      this.logger.error('Scheduled sync failed', error);
    } else {
      this.logger.log('Scheduled sync completed successfully');
    }
  }
}
