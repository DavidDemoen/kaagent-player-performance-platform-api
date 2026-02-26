import { APIError } from 'better-auth';
import { OpteamalPlayerDto, OpteamalTeamDto } from 'src/club-data/dto';

/**
 * Interface for the Opteamal API client.
 * Provides methods to fetch teams and players data from the Opteamal API.
 */
export interface IOpteamalApiClient {
  /**
   * Fetches teams data from the Opteamal API.
   * @returns {Promise<OpteamalTeamDto[] | APIError>} A promise that resolves to an array of teams data.
   */
  fetchTeamsData(): Promise<OpteamalTeamDto[] | APIError>;

  /**
   * Fetches players data from the Opteamal API.
   * @returns {OpteamalPlayerDto<Opteamal[] | APIError>} A promise that resolves to an array of players data.
   */
  fetchPlayersData(): Promise<OpteamalPlayerDto[] | APIError>;
}
