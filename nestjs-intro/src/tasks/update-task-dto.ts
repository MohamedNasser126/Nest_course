import { PartialType } from '@nestjs/mapped-types';
import { createTaskDTO } from './create.task.dto';

export class UpdateTaskFields extends PartialType(createTaskDTO) {}
