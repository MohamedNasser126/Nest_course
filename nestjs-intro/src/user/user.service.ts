import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { PasswordService } from './password/password.service';
import { CreateUserDTO } from './create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }
  public async findOneById(id: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }
  public async createUser(CreateUserDTO: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.passwordService.hash(
      CreateUserDTO.password,
    );
    const user = this.userRepo.create({
      ...CreateUserDTO,
      password: hashedPassword,
    });
    return await this.userRepo.save(user);
  }
}
