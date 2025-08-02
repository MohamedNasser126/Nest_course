import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { task } from '../tasks/task.entity';
import { Expose } from 'class-transformer';
import { Roles } from './roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;
  @Column()
  @Expose()
  name: string;
  @Column()
  @Expose()
  email: string;
  @Column()
  password: string;
  @CreateDateColumn()
  @Expose()
  createdAt: Date;
  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;
  @OneToMany(() => task, (task) => task.user)
  @Expose()
  tasks: task[];
  @Column('text', { array: true, default: [Roles.USER] })
  @Expose()
  role: Roles[];
}
