import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { task } from './task.entity';
import { TaskLabel } from './task.label.entity';

@Module({
  imports: [TypeOrmModule.forFeature([task, TaskLabel])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
