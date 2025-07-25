import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[A-Z]/, { message: 'must have 1 upper case letter' })
  @Matches(/[0-9]/, { message: 'must have 1 number' })
  @Matches(/[^A-Za-z0-9]/, { message: 'must have 1 special character' })
  password: string;
}
