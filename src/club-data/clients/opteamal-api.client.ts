import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { tryCatch } from 'lib/utils/error/try-catch';
import { catchError, firstValueFrom, retry, timeout } from 'rxjs';
import { IOpteamalApiClient } from 'src/interfaces/opteamalApiClient.interface';
import { OpteamalPlayerDto, OpteamalTeamDto } from '../dto';
import { APIError } from 'better-auth';

@Injectable()
export class OpteamalApiClient implements IOpteamalApiClient {
  private readonly logger = new Logger(OpteamalApiClient.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  fetchTeamsData(): Promise<OpteamalTeamDto[] | APIError> {
    throw new Error('Method not implemented.');
  }
  fetchPlayersData(): Promise<OpteamalPlayerDto[] | APIError> {
    throw new Error('Method not implemented.');
  }

  // TODO - implement fetchTeamsData and fetchPlayersData methods to call the external API and return the respective data
  // refactor this method to the two methods above and handle the respective endpoints for teams and players data
  // the data transform should be done in the service layer, this method should only be responsible for fetching the raw data from the external API
  // perhaps extract the common logic for fetching data from the external API into a separate private method to avoid code duplication between the two methods
  async fetchClubData(): Promise<any> {
    const opteamalApiUrl = this.configService.get('OPTEAMAL_API_URL');
    const apiKey = this.configService.get('OPTEAMAL_API_KEY');

    const { data, error } = await tryCatch(
      firstValueFrom(
        this.httpService
          .get(opteamalApiUrl, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          })
          .pipe(
            timeout(30000),
            retry({ count: 3, delay: 1000 }),
            catchError((error) => {
              this.logger.error(
                'Error fetching club data from external API',
                error,
              );
              throw error;
            }),
          ),
      ),
    );

    this.logger.debug(`External API response: ${JSON.stringify(data)}`);

    if (error) {
      this.logger.error(
        'Failed to fetch club data from external API',
        error.message,
      );
      throw error;
    }
    return data;
  }
}
