import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './baseentity';
import { FileTag } from './file.tag';
import { User } from './user';

export enum PrivacyStatus {
  isPublic = 'isPublic',
  isPrivate = 'isPrivate',
  isAuthenticated = 'isAuth',
}

@Entity()
export class File extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  size: number;

  @Column()
  mimetype: string;

  @Column({
    type: 'enum',
    enum: PrivacyStatus,
  })
  status: PrivacyStatus;

  @OneToMany(() => FileTag, (filetag) => filetag.file, {
    cascade: true,
    orphanedRowAction: 'delete',
    eager: true,
  })
  filetag: FileTag[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  user: User | number;
}
