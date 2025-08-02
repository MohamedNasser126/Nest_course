import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../create-user.dto';
import { User } from '../user.entity';
import { PasswordService } from '../password/password.service';

@Injectable()
// 1)check if user exists
// 2) store the user
// 3) generate token
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly JwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}
  public async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);

    if (
      !user ||
      !(await this.passwordService.verify(password, user.password))
    ) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return this.generateToken(user);
  }
  public async register(CreateUserDTO: CreateUserDTO) {
    const exisitngUser = await this.userService.findOneByEmail(
      CreateUserDTO.email,
    );
    if (exisitngUser) {
      throw new ConflictException('the email already exisits');
    }
    const user = await this.userService.createUser(CreateUserDTO);
    return user;
  }
  private generateToken(user: User): string {
    const payload = { sub: user.id, name: user.name, roles: user.role };
    return this.JwtService.sign(payload);
  }
}
