import { Page } from '@app/common/database/dto/page';
import { Pageable } from '@app/common/database/dto/pageable';
import { Sort } from '@app/common/database/dto/sort';
import { BaseModel } from '@app/common/database/models/base.model';
import { Repository } from '@app/common/database/repository/repository';
import { ReferenceKeys } from '@app/common/database/utils/database-types';

export abstract class PageRepository<
  T extends BaseModel,
> extends Repository<T> {
  abstract findAllPaginated(
    pageable: Pageable,
    ...joins: ReferenceKeys<T>[]
  ): Promise<Page<T>>;

  abstract findAllSorted(
    sort: Sort<T>[],
    ...joins: ReferenceKeys<T>[]
  ): Promise<T[]>;
}
