import { Type } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { constants } from '@app/common/database/constants';
import { Page } from '@app/common/database/dto/page';
import { Pageable } from '@app/common/database/dto/pageable';
import { Sort } from '@app/common/database/dto/sort';
import { BaseModel } from '@app/common/database/models/base.model';
import { MongooseRepository } from '@app/common/database/repository/mongo.repository';
import { PageRepository } from '@app/common/database/repository/page.repository';
import {
  AbstractConstructor,
  ReferenceKeys,
} from '@app/common/database/utils/database-types';
import { ModelUtils } from '@app/common/database/utils/models.utils';

/**
 * This is a mixin function that adds pagination support to a repository class with Mongoose implmenetation
 * along with the {@link Repository} implementation as well.
 *
 * The usage is similar to {@link MongooseRepository}

 * @param entity the entity class to which the repository is to be applied
 * @param base   the base repository to which the implementationis to be used.
 * @returns an abstract class that has a mongoose implmentation of {@link PageRepository}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const PageMongooseRepository = <
  M extends BaseModel,
  T extends AbstractConstructor<PageRepository<M>>,
>(
  entity: Type<M>,
  base: T,
) => {
  abstract class PaginatedMongooseMixinRepository extends MongooseRepository(
    entity,
    base,
  ) {
    constructor(...args: any[]);
    constructor(readonly model: Model<M>) {
      super();
    }

    async findAllPaginated(
      pageable: Pageable,
      ...joins: ReferenceKeys<M>[]
    ): Promise<Page<M>> {
      const query = this.model.find();
      ModelUtils.populate(query, joins);
      return this.paginate(query, pageable);
    }

    async findAllSorted(
      sort: Sort<M>[],
      ...joins: ReferenceKeys<M>[]
    ): Promise<M[]> {
      const query = this.model.find().sort(ModelUtils.generateSortQuery(sort));
      ModelUtils.populate(query, joins);
      return (await query).map((entity) => entity.toObject<M>());
    }

    async paginate(
      query: mongoose.Query<
        mongoose.HydratedDocument<M>[],
        mongoose.HydratedDocument<M>
      >,
      pageable: Pageable,
    ): Promise<Page<M>> {
      const size =
        pageable.size && pageable.size >= 1
          ? pageable.size
          : constants.DEFAULT_PAGE_SIZE;
      const page =
        pageable.page && pageable.page >= 1
          ? pageable.page
          : constants.DEFAULT_PAGE_NUMBER;
      const skip = (page - 1) * size;
      const totalElements = await query.clone().count().exec();
      const totalPages = Math.ceil(totalElements / size);
      const data = await query
        .sort(ModelUtils.generateSortQueryFromPageable(pageable))
        .skip(skip)
        .limit(size)
        .exec();
      return new Page<M>({
        page,
        size,
        first: page === 1,
        last: page === totalPages,
        totalElements,
        totalPages,
        data: data.map((d) => d.toObject<M>()),
      });
    }
  }
  return PaginatedMongooseMixinRepository;
};
