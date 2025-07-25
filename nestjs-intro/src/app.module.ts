/* eslint-disable @typescript-eslint/no-misused-promises */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { LoggerService } from './logger/logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/typeOrm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config';
import { task } from './tasks/task.entity';
import { User } from './user/user.entity';
import { TaskLabel } from './tasks/task.label.entity';
import { authConfig } from './config/auth.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        ...configService.get('database'),
        entities: [task, User, TaskLabel],
      }),
    }),
    ConfigModule.forRoot({
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: { abortEarly: true },
    }),
    TasksModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageFormatterService,
    LoggerService,
    { provide: TypedConfigService, useExisting: ConfigService },
  ],
})
export class AppModule {}
