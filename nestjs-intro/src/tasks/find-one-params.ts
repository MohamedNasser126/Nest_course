import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneParam {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
