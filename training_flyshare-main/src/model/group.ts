import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { GroupStatus } from '../enum/group-privacy';
import { BaseEntity } from './baseentity';
import { GroupTag } from './group-tag';
import { User } from './user';

@Entity()
export class UserGroup extends BaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => GroupTag, (groupTag) => groupTag.usergrouptag, {
    cascade: true,
    orphanedRowAction: 'delete',
    eager: true,
  })
  groupTag: GroupTag[];

  @Column({
    type: 'enum',
    enum: GroupStatus,
  })
  status: string;

  @ManyToMany(() => User)
  @JoinTable()
  USERS: User;

  @ManyToMany(() => User)
  @JoinTable()
  ADMIN: User;

  @ManyToMany(() => User)
  @JoinTable()
  MODERATOR: User;

  @ManyToOne(() => User)
  user: User | number;
}
