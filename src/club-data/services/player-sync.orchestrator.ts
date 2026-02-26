import { Injectable, Logger } from '@nestjs/common';
import { PlayersRepository } from '../repositories/player.repository';
import { PlayersPositionsHistoryRepository } from '../repositories/players-positions-history.repository';
import { PlayersTeamsHistoryRepository } from '../repositories/players-teams-history.repository';
import { TeamsRepository } from '../repositories/teams.repository';
import { OpteamalPlayerDto, PlayerInsert, PlayerUpsertObject } from '../dto';
import { APIError } from 'better-auth';
import { PositionsRepository } from '../repositories/position.repository';
import { generatePlayerSlug } from 'lib/utils/slugs';

@Injectable()
export class PlayerSyncOrchestrator {
  private readonly logger = new Logger(PlayerSyncOrchestrator.name);

  constructor(
    private readonly playersRepository: PlayersRepository,
    private readonly teamsRepository: TeamsRepository,
    private readonly teamsHistoryRepository: PlayersTeamsHistoryRepository,
    private readonly positionsHistoryRepository: PlayersPositionsHistoryRepository,
    private readonly positionsRepository: PositionsRepository,
  ) {}

  async syncPlayers(
    playersData: OpteamalPlayerDto[],
  ): Promise<void | APIError> {
    for (const playerData of playersData) {
      // 1. Transform player data
      const { player, teamHistoryObject, positionsHistoryObjects } =
        this.transformPlayerData(playerData);

      // 2. Upsert Player Data
      const playerUpsertResp =
        await this.playersRepository.upsertPlayer(player);

      if (playerUpsertResp instanceof Error) {
        this.logger.error(
          `Error upserting player with opteamal id ${player.opteamalId}`,
          playerUpsertResp,
        );
        return playerUpsertResp;
      }

      if (teamHistoryObject) {
        this.logger.log(
          `Syncing team history for player with opteamal id ${player.opteamalId}`,
        );
        const teamResponse = await this.teamsRepository.findByOpteamalKey(
          teamHistoryObject.opteamalTeamKey,
        );

        if (teamResponse instanceof Error) {
          this.logger.error(
            `Error finding team with opteamal key ${teamHistoryObject.opteamalTeamKey} for player with opteamal id ${player.opteamalId}`,
            teamResponse,
          );
          return teamResponse;
        }

        const teamHistoryResp =
          await this.teamsHistoryRepository.upsertTeamHistory({
            playerId: playerUpsertResp.id,
            teamKey: teamResponse.teamKey,
            isCurrent: teamHistoryObject.isCurrent,
            isPrimaryTeam: teamHistoryObject.isPrimaryTeam,
          });

        if (teamHistoryResp instanceof Error) {
          this.logger.error(
            `Error upserting team history for player with opteamal id ${player.opteamalId} and team with opteamal key ${teamHistoryObject.opteamalTeamKey}`,
            teamHistoryResp,
          );
          return teamHistoryResp;
        }

        if (positionsHistoryObjects) {
          this.logger.log(
            `Syncing positions history for player with opteamal id ${player.opteamalId}`,
          );
          for (const positionHistoryObject of positionsHistoryObjects) {
            this.logger.log(
              `Syncing position ${positionHistoryObject.positionName} for player with opteamal id ${player.opteamalId}`,
            );

            const response = await this.positionsRepository.createPosition({name: positionHistoryObject.positionName});

            const positionUpsertResp =
              await this.positionsHistoryRepository.upsertPositionsHistory({
                playerId: playerUpsertResp.id,
                positionName: positionHistoryObject.positionName,
                isCurrent: positionHistoryObject.isCurrent,
                validFromDt: positionHistoryObject.validFromDt,
                validToDt: positionHistoryObject.validToDt,
              });
            if (positionUpsertResp instanceof Error) {
              this.logger.error(
                `Error upserting position history for player with opteamal id ${player.opteamalId} and position ${positionHistoryObject.positionName}`,
                positionUpsertResp,
              );
              return positionUpsertResp;
            }
          }
        }
      }
    }
  }

  private transformPlayerData(
    opteamalPlayer: OpteamalPlayerDto,
  ): PlayerUpsertObject {
    const {
      id: opteamalId,
      firstname: firstName,
      lastname: lastName,
      birthdate: birthDate,
      gender,
      nationality,
      second_nationality: secondNationality,
      insert_in_opteamal_dt: createdAt,
      update_player_dt: updatedAt,
      team: opteamalTeamKey,
      active_in_team: activeInTeam,
      primary_team: primaryTeam,
      positions,
    } = opteamalPlayer;

    const player: PlayerInsert = {
      opteamalId,
      firstName,
      lastName,
      birthDate,
      gender: gender ?? 'not_provided',
      nationality: nationality ?? 'not_provided',
      secondNationality,
      slug: generatePlayerSlug(firstName, lastName),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
    };

    const teamHistoryObject = {
      opteamalTeamKey,
      opteamalPlayerId: opteamalId,
      isCurrent: activeInTeam,
      isPrimaryTeam: primaryTeam,
    };

    const positionsHistoryObjects = positions
      ? positions.map(({ position, valid_from_dt, valid_to_dt }) => ({
          opteamalPlayerId: opteamalId,
          positionName: position,
          isCurrent: true,
          validFromDt: valid_from_dt ? new Date(valid_from_dt) : new Date(0),
          validToDt: valid_to_dt ? new Date(valid_to_dt) : null,
        }))
      : null;

    return {
      player,
      teamHistoryObject,
      positionsHistoryObjects,
    };
  }
}
