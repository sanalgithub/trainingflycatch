import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './baseentity';
import { File } from './file';

@Entity()
export class FileTag extends BaseEntity {
  @Column()
  tag: string;
  @ManyToOne(() => File)
  file: File;
}
