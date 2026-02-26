import { Injectable } from '@nestjs/common';
import { TeamsRepository } from '../repositories/teams.repository';
import { OpteamalTeamDto, TeamInsert } from '../dto';
import { APIError } from 'better-auth';

@Injectable()
export class TeamsSyncOrchestrator {
  constructor(private readonly teamsRepository: TeamsRepository) {}

  async syncTeams(teamsData: OpteamalTeamDto[]): Promise<void | APIError> {
    const transformedTeamObjects = teamsData.map((teamData) =>
      this.transformTeamData(teamData),
    );

    const error = this.teamsRepository.upsertBatch(transformedTeamObjects);

    return error;
  }

  private transformTeamData({ teamkey, name }: OpteamalTeamDto): TeamInsert {
    return {
      name,
      opteamalKey: teamkey,
    };
  }
}
