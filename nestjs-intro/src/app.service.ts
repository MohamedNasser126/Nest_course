import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';

import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config';

@Injectable()
export class AppService {
  constructor(
    private logger: LoggerService,
    private configService: TypedConfigService,
  ) {}
  getHello(): string {
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return this.logger.log(`${prefix} hello`);
  }
}
