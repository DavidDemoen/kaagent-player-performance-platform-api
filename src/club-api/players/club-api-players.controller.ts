import { Controller, Get, Param } from '@nestjs/common';
import { ClubApiPlayersService } from './club-api-players.service';

@Controller('club-data/players')
export class ClubApiPlayersController {
  constructor(private readonly playerService: ClubApiPlayersService) {}

  @Get()
  async getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Get(':id')
  async getPlayerById(@Param('id') id: string) {
    return this.playerService.getPlayerById(id);
  }
}
