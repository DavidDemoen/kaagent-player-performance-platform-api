import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { ClubApiTeamsController } from './teams/club-api-teams.controller';
import { ClubApiPlayersController } from './players/club-api-players.controller';
import { ClubApiPlayersService } from './players/club-api-players.service';
import { ClubApiTeamsService } from './teams/club-api-teams.service';
import { ClubApiPositionsController } from './player-positions/club-api-positions.controller';
import { ClubApiPositionsService } from './player-positions/club-api-positions.service';


@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ClubApiTeamsController, ClubApiPlayersController, ClubApiPositionsController],
  providers: [ClubApiPlayersService, ClubApiTeamsService, ClubApiPositionsService],
})
export class ClubApiModule {}
