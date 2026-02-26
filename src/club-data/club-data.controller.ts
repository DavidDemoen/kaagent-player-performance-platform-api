import { Controller, Post } from '@nestjs/common';
import { ClubDataService } from './services/club-data.service';
import { error } from 'console';

@Controller('club-data-sync')
export class ClubDataController {
  constructor(private readonly clubDataService: ClubDataService) {}

  @Post('sync')
  async syncClubData(): Promise<Error | { message: string }> {
    const response = await this.clubDataService.syncClubData();
    if (response instanceof Error) {
      return response;
    }
    return { message: 'Club data synchronization completed successfully' };
  }
}
