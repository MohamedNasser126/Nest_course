import { Body, Controller, Post } from '@nestjs/common';
import { PasswordService } from '../password/password.service';
import { CreateUserDTO } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { loginDto } from '../login.dto';
import { loginResponse } from '../login.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  public async register(@Body() CreateUserDTO: CreateUserDTO): Promise<User> {
    return await this.authService.register(CreateUserDTO);
  }

  @Post('login')
  public async login(@Body() loginDTO: loginDto): Promise<loginResponse> {
    const accessToken = await this.authService.login(
      loginDTO.email,
      loginDTO.password,
    );
    return { accessToken };
  }
}
