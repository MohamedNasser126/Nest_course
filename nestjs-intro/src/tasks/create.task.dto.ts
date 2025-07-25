import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { TaskStatus } from './task.model';
import { taskLabelDTO } from './create.task.label.dto';
import { Type } from 'class-transformer';

export class createTaskDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
  @IsNotEmpty()
  @IsUUID()
  userId: string;
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => taskLabelDTO)
  labels?: taskLabelDTO[];
}
