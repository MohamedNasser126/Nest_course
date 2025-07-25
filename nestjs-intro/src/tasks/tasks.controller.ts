import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

import { createTaskDTO } from './create.task.dto';
import { FindOneParam } from './find-one-params';
import { UpdateTaskFields } from './update-task-dto';
import { WrongTaskStatusException } from './exceptions/wrong-order-in-status';
import { task } from './task.entity';
import { taskLabelDTO } from './create.task.label.dto';
import { FindTaskParams } from './find-task-params';

import { PaginationResponses } from 'src/common/pagination.response';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  public async findAll(
    @Query() taskFiltersAndPagination: FindTaskParams,
  ): Promise<PaginationResponses<task>> {
    const [items, total] = await this.tasksService.findAll(
      taskFiltersAndPagination,
    );

    return {
      data: items,
      meta: {
        total,

        offset: taskFiltersAndPagination.offset,
        limit: taskFiltersAndPagination.limit,
      },
    };
  }

  @Get('/:id')
  public async findOne(@Param() params: FindOneParam): Promise<task> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  public async create(@Body() createTaskDTO: createTaskDTO): Promise<task> {
    return await this.tasksService.createTask(createTaskDTO);
  }

  @Patch('/:id')
  public async updateTask(
    @Param() params: FindOneParam,
    @Body() updateTaskDto: UpdateTaskFields,
  ): Promise<task> {
    const task = await this.findOneOrFail(params.id);
    try {
      return await this.tasksService.updateTask(task, updateTaskDto);
    } catch (error) {
      if (error instanceof WrongTaskStatusException) {
        throw new BadRequestException([error.message]);
      }
      throw error;
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteOne(@Param() params: FindOneParam): Promise<void> {
    const task = await this.findOneOrFail(params.id);
    await this.tasksService.deleteOne(task);
  }

  @Post('/:id/labels')
  public async addLabel(
    @Param() { id }: FindOneParam,
    @Body() labels: taskLabelDTO[],
  ): Promise<task> {
    const task = await this.findOneOrFail(id);
    return await this.tasksService.addLabels(task, labels);
  }
  @Delete('/:id/labels')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeLabel(
    @Param() { id }: FindOneParam,
    @Body() labelsToBeRemoved: string[],
  ): Promise<void> {
    const task = await this.findOneOrFail(id);
    await this.tasksService.removeLabels(task, labelsToBeRemoved);
  }
  public async findOneOrFail(id: string): Promise<task> {
    const task = await this.tasksService.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }
}
