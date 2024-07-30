import { BaseModel } from '@app/common/database';
import { ReferenceKeys } from '@app/common/database/utils/database-types';

export abstract class Repository<T extends BaseModel> {
  abstract save(model: T): Promise<T>;
  abstract saveAll(model: T[]): Promise<T[]>;

  abstract findOne(...joins: ReferenceKeys<T>[]): Promise<T | undefined>;

  abstract findById(
    id: string,
    ...joins: ReferenceKeys<T>[]
  ): Promise<T | undefined>;

  abstract findAll(...joins: ReferenceKeys<T>[]): Promise<T[]>;

  abstract deleteById(id: string): Promise<void>;
  abstract deleteMany(...id: string[]): Promise<number>;

  abstract existsById(id: string): Promise<boolean>;
}
