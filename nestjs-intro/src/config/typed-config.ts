import { ConfigService } from '@nestjs/config';
import { configType } from './config.types';

export class TypedConfigService extends ConfigService<configType> {}
