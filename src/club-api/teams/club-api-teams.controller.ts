import { Controller, Get, Param } from '@nestjs/common';
import { ClubApiTeamsService } from './club-api-teams.service';

@Controller('club-data/teams')
export class ClubApiTeamsController {
  constructor(private readonly teamsService: ClubApiTeamsService) {}

  @Get()
  async getAllTeams() {
    return this.teamsService.getAllTeams();
  }

  @Get(':team_key')
  async getTeamById(@Param('team_key') teamKey: string) {
    return this.teamsService.getTeamByKey(teamKey);
  }

  @Get('opteamal/:opteamal_key/player-hist')
  async getTeamByOpteamalKey(@Param('opteamal_key') opteamalKey: string) {
    return this.teamsService.getTeamByOpteamalKeyWithPlayerHist(opteamalKey);
  }
}
