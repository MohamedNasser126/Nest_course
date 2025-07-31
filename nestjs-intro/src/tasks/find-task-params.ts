import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './task.model';
import { Transform } from 'class-transformer';
import { PaginationParams } from './../common/pagination.params';

export class FindTaskParams extends PaginationParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;
    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length);
  })
  labels?: string[];

  @IsOptional()
  @IsIn(['createdAt', 'name', 'status'])
  sortBy?: string = 'createdAt';
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}
