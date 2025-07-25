import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { createTaskDTO } from './create.task.dto';

import { UpdateTaskFields } from './update-task-dto';
import { WrongTaskStatusException } from './exceptions/wrong-order-in-status';

import { Repository } from 'typeorm';
import { task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { taskLabelDTO } from './create.task.label.dto';
import { TaskLabel } from './task.label.entity';
import { FindTaskParams } from './find-task-params';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(task)
    private readonly taskRepo: Repository<task>,
    @InjectRepository(TaskLabel)
    private readonly taskLabelRepo: Repository<TaskLabel>,
  ) {}

  public async findAll(
    taskFiltersAndPagination: FindTaskParams,
  ): Promise<[task[], number]> {
    const query = this.taskRepo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.labels', 'labels');

    if (taskFiltersAndPagination.status) {
      query.andWhere('task.status=:status', {
        status: taskFiltersAndPagination.status,
      });
    }

    if (taskFiltersAndPagination.search) {
      query.andWhere(
        'task.name ILIKE :search OR task.description ILIKE :search',
        { search: `%${taskFiltersAndPagination.search}%` },
      );
    }

    if (taskFiltersAndPagination.labels?.length) {
      const subquery = query
        .subQuery()
        .select('labels.taskId')
        .from('task_label', 'labels')
        .where('labels.name IN (:...names)', {
          names: taskFiltersAndPagination.labels,
        })
        .getQuery();

      query.andWhere(`task.id IN ${subquery}`);
    }
    query.orderBy(
      `task.${taskFiltersAndPagination.sortBy}`,
      taskFiltersAndPagination.sortOrder,
    );
    query
      .skip(taskFiltersAndPagination.offset)
      .take(taskFiltersAndPagination.limit);

    return query.getManyAndCount();
  }

  ////////////////////////////////////////////////
  public async findOne(id: string): Promise<task | null> {
    return await this.taskRepo.findOne({
      where: { id },
      relations: ['labels'],
    });
  }

  public async createTask(createTaskDTO: createTaskDTO): Promise<task> {
    if (createTaskDTO.labels) {
      createTaskDTO.labels = this.uniqueLabels(createTaskDTO.labels);
    }
    return await this.taskRepo.save(createTaskDTO);
  }

  public async updateTask(
    task: task,
    updateFields: UpdateTaskFields,
  ): Promise<task> {
    if (
      updateFields.status &&
      !this.checkStatusUpdate(task.status, updateFields.status)
    ) {
      throw new WrongTaskStatusException();
    }
    if (updateFields.labels) {
      updateFields.labels = this.uniqueLabels(updateFields.labels);
    }
    const updatedtask = Object.assign(task, updateFields);
    return await this.taskRepo.save(updatedtask);
  }
  public async addLabels(task: task, newLabels: taskLabelDTO[]): Promise<task> {
    const ExisitingLabels = new Set(task.labels.map((labels) => labels.name));
    const labels = this.uniqueLabels(newLabels)
      .filter((label) => !ExisitingLabels.has(label.name))
      .map((label) => this.taskLabelRepo.create(label));
    if (labels.length) {
      task.labels = [...task.labels, ...labels];
      return await this.taskRepo.save(task);
    }
    return task;
  }

  public async removeLabels(
    task: task,
    labelsToBeRemoved: string[],
  ): Promise<task> {
    task.labels = task.labels.filter(
      (label) => !labelsToBeRemoved.includes(label.name),
    );
    return await this.taskRepo.save(task);
  }
  public async deleteOne(task: task): Promise<void> {
    await this.taskRepo.remove(task);
  }
  private checkStatusUpdate(
    oldStatus: TaskStatus,
    newStatus: TaskStatus,
  ): boolean {
    const statusOrder = [
      TaskStatus.OPEN,
      TaskStatus.IN_PROGRESS,
      TaskStatus.DONE,
    ];
    return statusOrder.indexOf(oldStatus) <= statusOrder.indexOf(newStatus);
  }

  private uniqueLabels(labelsDto: taskLabelDTO[]): taskLabelDTO[] {
    const unqiueLabels = [...new Set(labelsDto.map((label) => label.name))];
    return unqiueLabels.map((name) => ({ name }));
  }
}
