import { Column, Entity, ManyToOne } from 'typeorm';
import { UserGroup } from './group';
import { BaseEntity } from './baseentity';

@Entity()
export class GroupTag extends BaseEntity {
  @Column()
  tag: string;
  @ManyToOne(() => UserGroup)
  usergrouptag: UserGroup;
}
