import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseentity';
import { User } from './user';

@Entity()
export class Token extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expiretime: Date;

  @ManyToOne(() => User, { nullable: true })
  uservalue: User;
}
