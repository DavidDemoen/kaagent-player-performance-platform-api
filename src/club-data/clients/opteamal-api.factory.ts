import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockOpteamalApiClient } from './mock-opteamal-api.client';
import { OpteamalApiClient } from './opteamal-api.client';
import { IOpteamalApiClient } from 'src/interfaces/opteamalApiClient.interface';

@Injectable()
export class OpteamalApiClientFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly mockClient: MockOpteamalApiClient,
    private readonly realClient: OpteamalApiClient,
  ) {}

  createClient(): IOpteamalApiClient {
    const useTestData = this.configService.get('OPTEAMAL_MOCK_MODE', 'false');

    switch (useTestData.toLowerCase()) {
      case 'true':
        return this.mockClient;
      case 'false':
        return this.realClient;
      default:
        throw new Error(`Invalid value for USE_TEST_DATA: ${useTestData}`);
    }
  }
}
