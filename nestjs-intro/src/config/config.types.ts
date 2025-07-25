import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import * as joi from 'joi';
import { AuthConfig } from './auth.config';
export interface configType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}
export const appConfigSchema = joi.object({
  AppMessagePrefix: joi.string().default('hello '),
  DB_HOST: joi.string().default('localhost'),
  DB_PORT: joi.number().default(5432),
  DB_USERNAME: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_SYNC: joi.number().valid(0, 1).required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRES_IN: joi.string().required(),
});
