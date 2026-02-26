import { Injectable, Logger } from '@nestjs/common';
import { IOpteamalApiClient } from 'src/interfaces/opteamalApiClient.interface';
import { OpteamalPlayerDto, OpteamalTeamDto } from '../dto';
import {
  opteamalPlayersMockData,
  opteamalTeamsMockData,
} from 'data/opteamal-mock-data/opteamal-mock-data';
import { APIError } from 'better-auth';

@Injectable()
export class MockOpteamalApiClient implements IOpteamalApiClient {
  private readonly logger = new Logger(MockOpteamalApiClient.name);

  async fetchTeamsData(): Promise<OpteamalTeamDto[] | APIError> {
    this.logger.log('Loading test data from opteamal mock data...');
    try {
      // Simulate async operation
      return opteamalTeamsMockData;
    } catch (error) {
      this.logger.error('Error loading teams data from mock data', error);
      return new APIError(500, {
        cause: error,
        statusCode: 500,
        message: 'Error loading teams data from mock data',
      });
    }
  }

  async fetchPlayersData(): Promise<OpteamalPlayerDto[] | APIError> {
    this.logger.log('Loading test data from opteamal mock data...');
    try {
      // Simulate async operation
      return opteamalPlayersMockData;
    } catch (error) {
      this.logger.error('Error loading players data from mock data', error);
      return new APIError(500, {
        cause: error,
        statusCode: 500,
        message: 'Error loading players data from mock data',
      });
    }
  }

  // Example: Add more mock endpoints as needed
  // async fetchSomethingElse(): Promise<SomeDto[] | APIError> {
  //   this.logger.log('Loading test data from mock data...');
  //   try {
  //     return someMockData;
  //   } catch (error) {
  //     this.logger.error('Error loading data from mock data', error);
  //     return new APIError(500, {
  //       cause: error,
  //       statusCode: 500,
  //       message: 'Error loading data from mock data',
  //     });
  //   }
  // }
}
