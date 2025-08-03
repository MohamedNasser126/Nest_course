import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDTO } from '../create-user.dto';
import { AuthService } from './auth.service';
import { User } from '../user.entity';
import { loginDto } from '../login.dto';
import { loginResponse } from '../login.response';
import { AuthRequest } from '../auth.request';
import { UserService } from '../user.service';
import { Public } from '../decorators/public.decorators';
import { AdminResponse } from '../admin.response';
import { Role } from '../decorators/roles.decorators';
import { Roles } from '../roles.enum';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @Public()
  public async register(@Body() CreateUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.authService.register(CreateUserDTO);
    return user;
  }

  @Post('login')
  @Public()
  public async login(@Body() loginDTO: loginDto): Promise<loginResponse> {
    const accessToken = await this.authService.login(
      loginDTO.email,
      loginDTO.password,
    );
    return new loginResponse({ accessToken });
  }
  @Get('/profile')
  async profile(@Request() req: AuthRequest): Promise<User> {
    const user = await this.userService.findOneById(req.user.sub);

    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  @Get('admin')
  @Role(Roles.ADMIN)
  // eslint-disable-next-line @typescript-eslint/require-await
  async adminOnly(): Promise<AdminResponse> {
    return new AdminResponse({ message: 'this is an admin endpoint ' });
  }
}
