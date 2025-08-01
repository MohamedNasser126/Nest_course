import { Expose } from 'class-transformer';

export class loginResponse {
  constructor(private readonly partial?: Partial<loginResponse>) {
    Object.assign(this, partial);
  }
  @Expose()
  accessToken: string;
}
