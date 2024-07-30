import { Column, Entity } from 'typeorm';
import { BaseEntity } from './baseentity';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;
}
