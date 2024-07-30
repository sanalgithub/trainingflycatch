import { Type } from '@nestjs/common';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { Page } from '@app/common/database/dto/page';
import { Pageable } from '@app/common/database/dto/pageable';
import { BaseModel } from '@app/common/database/models/base.model';
import { PageMongooseRepository } from '@app/common/database/repository/page-mongo.repository';
import { QueryByExampleRepository } from '@app/common/database/repository/query-by-example.repository';
import {
  AbstractConstructor,
  ReferenceKeys,
} from '@app/common/database/utils/database-types';
import { ModelUtils } from '@app/common/database/utils/models.utils';

/**
 * This is a mixin function that adds suppport to query by example of a model in a repository using mongoose implmenetation.
 *
 * The usage is similar to {@link MongooseRepository}
 *
 * @param entity the entity class to which the repository is to be applied
 * @param base   the base repository to which the implementationis to be used.
 * @returns an abstract class that has a mongoose implmentation of {@link QueryByExampleRepository}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const QueryByExampleMongooseRepository = <
  M extends BaseModel,
  T extends AbstractConstructor<QueryByExampleRepository<M>>,
>(
  entity: Type<M>,
  base: T,
) => {
  abstract class QueryByExampleMongooseMixinRepository extends PageMongooseRepository(
    entity,
    base,
  ) {
    constructor(...args: any[]);
    constructor(readonly model: Model<M>) {
      super();
    }

    async findOneByExample(
      example: Partial<M>,
      ...joins: ReferenceKeys<M | undefined>[]
    ): Promise<M | undefined> {
      if (example.id && !isValidObjectId(example.id)) {
        return undefined;
      }
      const query = this.model.findOne(example as FilterQuery<T>);
      ModelUtils.populate(query, joins);
      return (await query)?.toObject<M>();
    }

    async findAllByExample(
      example: Partial<M>,
      ...joins: ReferenceKeys<M>[]
    ): Promise<M[]> {
      if (example.id && !isValidObjectId(example.id)) {
        return [];
      }
      const query = this.model.find(example);
      ModelUtils.populate(query, joins);
      return (await query).map((entity) => entity.toObject<M>());
    }

    findAllPaginatedByExample(
      example: Partial<M>,
      pageable: Pageable,
      ...joins: ReferenceKeys<M>[]
    ): Promise<Page<M>> {
      const query = this.model.find(example);
      ModelUtils.populate(query, joins);
      return this.paginate(query, pageable);
    }

    async deleteByExample(example: Partial<M>): Promise<void> {
      if (example.id && !isValidObjectId(example.id)) {
        return;
      }
      await this.model.deleteMany(example).exec();
    }

    async existsByExample(example: Partial<M>): Promise<boolean> {
      return (await this.countByExample(example)) !== 0;
    }

    async countByExample(example: Partial<M>): Promise<number> {
      if (example.id && !isValidObjectId(example.id)) {
        return 0;
      }
      return this.model.countDocuments(example).exec();
    }
  }
  return QueryByExampleMongooseMixinRepository;
};
