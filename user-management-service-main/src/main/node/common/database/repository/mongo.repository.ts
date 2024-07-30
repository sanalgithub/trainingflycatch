import { Logger, Type } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { BaseModel, ModelUtils, Repository } from '@app/common/database';
import { constants } from '@app/common/database/constants';
import {
  AbstractConstructor,
  ReferenceKeys,
} from '@app/common/database/utils/database-types';

const logger: Logger = new Logger(constants.MONGOOSE_REPOSITORY_LOGGER_NAME);

/**
 * This is a mixin function that combines a base repository class with the Mongoose implementation of {@link Repository}.
 * example:
 *  Lets say we have a model
 *  <code>
 *    class ExampleModel extends BaseModel {}
 *  </code>
 *  with a repository
 *  <code>
 *    abstract class ExampleRepository extends Repository<ExampleModel> {}
 *  </code>
 *  then this class would have a mongoose implementation as follows
 *  <code>
 *    class MongooseExampleRepository extends MongooseRepository(Example, ExampleRepository) {
 *        constructor(@Inject(Example.name) model: Model<Example>) {
 *          super()
 *        }
 *    }
 *  </code>
 *
 *  The class heirarchy would look like the following.
 *
 *  {@link Repository<ExampleModel>} -> ExampleRepository -> MongooseMixinRepository -> MongooseExampleRepository
 *
 *  here MongooseMixinRepository is the class the function {@link MongooseRepository} returns.
 *
 * @param entity the entity class to which the repository is to be applied
 * @param base   the base repository to which the implementationis to be used.
 * @returns an abstract class that has a mongoose implmentation of {@link Repository}
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const MongooseRepository = <
  M extends BaseModel,
  T extends AbstractConstructor<Repository<M>>,
>(
  entity: Type<M>,
  base: T,
) => {
  abstract class MongooseMixinRepository extends base {
    constructor(...args: any[]);
    constructor(readonly model: Model<M>) {
      super();
    }

    async save(model: M): Promise<M> {
      if (!ModelUtils.isEntity(model)) {
        return (await this.model.create(model)).toObject<M>();
      }
      const savedModel = await this.model.findOneAndUpdate(
        { _id: model.id },
        model,
        {
          returnDocument: 'after',
          sanitizeFilter: true,
        },
      );
      if (!savedModel) {
        throw new Error('mongoose entity save returned null');
      }
      return savedModel.toObject<M>();
    }

    saveAll(models: M[]): Promise<M[]> {
      return Promise.all(models.map((model) => this.save(model)));
    }

    async findById(
      id: string,
      ...joins: ReferenceKeys<M>[]
    ): Promise<M | undefined> {
      if (!isValidObjectId(id)) {
        logger.warn(`invalid object id ${id}`);
        return undefined;
      }

      const query = this.model.findById(id);
      ModelUtils.populate(query, ...joins);
      return (await query)?.toObject<M>();
    }

    async findOne(...joins: ReferenceKeys<M>[]): Promise<M | undefined> {
      const query = this.model.findOne({});
      ModelUtils.populate(query, ...joins);
      return (await query)?.toObject<M>();
    }

    async findAll(...joins: ReferenceKeys<M>[]): Promise<M[]> {
      const query = this.model.find();
      ModelUtils.populate(query, ...joins);
      return (await query).map((entity) => entity.toObject<M>());
    }

    async deleteById(id: string): Promise<void> {
      if (!isValidObjectId(id)) {
        logger.warn(`invalid object id ${id}`);
        throw new Error(constants.INVALID_OBJECT_ID);
      }
      await this.model.deleteOne({ _id: id });
    }

    async deleteMany(...ids: string[]): Promise<number> {
      if (ids.find((id) => !isValidObjectId(id))) {
        throw new Error(constants.INVALID_OBJECT_ID);
      }
      return (await this.model.deleteMany({ _id: { $in: [...ids] } }))
        .deletedCount;
    }

    async existsById(id: string): Promise<boolean> {
      if (!isValidObjectId(id)) {
        logger.warn(`invalid object id ${id}`);
        return false;
      }
      return (await this.model.countDocuments({ _id: id })) !== 0;
    }
  }
  return MongooseMixinRepository;
};
