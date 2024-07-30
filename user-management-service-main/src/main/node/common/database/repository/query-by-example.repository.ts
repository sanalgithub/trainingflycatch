import { Page } from '@app/common/database/dto/page';
import { Pageable } from '@app/common/database/dto/pageable';
import { BaseModel } from '@app/common/database/models/base.model';
import { PageRepository } from '@app/common/database/repository/page.repository';
import { ReferenceKeys } from '@app/common/database/utils/database-types';

export abstract class QueryByExampleRepository<
  T extends BaseModel,
> extends PageRepository<T> {
  abstract findOneByExample(
    example: Partial<T>,
    ...joins: ReferenceKeys<T>[]
  ): Promise<T | undefined>;

  abstract findAllByExample(
    example: Partial<T>,
    ...joins: ReferenceKeys<T>[]
  ): Promise<T[]>;

  abstract findAllPaginatedByExample(
    example: Partial<T>,
    pageable: Pageable,
    ...joins: ReferenceKeys<T>[]
  ): Promise<Page<T>>;

  abstract deleteByExample(example: Partial<T>): Promise<void>;
  abstract existsByExample(example: Partial<T>): Promise<boolean>;
  abstract countByExample(example: Partial<T>): Promise<number>;
}
