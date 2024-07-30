import { DynamicModule, Module, Type } from '@nestjs/common';
import {
  ModelDefinition,
  MongooseModule,
  SchemaFactory,
} from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import mongoose, { ToObjectOptions } from 'mongoose';
import { DatabaseConfig } from '@app/common/database/config/database.config';
import { BaseModel } from '@app/common/database/models/base.model';
import { ModelUtils } from '@app/common/database/utils/models.utils';

@Module({
  providers: [DatabaseConfig],
})
export class DatabaseModule {
  static async forRoot(): Promise<DynamicModule> {
    return {
      module: DatabaseModule,
      imports: [MongooseModule.forRootAsync({ useClass: DatabaseConfig })],
    };
  }

  static async forFeature<T extends BaseModel>(
    ...entities: Type<T>[]
  ): Promise<DynamicModule> {
    const defenitions = DatabaseModule.getModelDefinitions(...entities);
    const module = MongooseModule.forFeature(defenitions);
    return {
      module: DatabaseModule,
      imports: [module],
      exports: [module],
    };
  }

  private static getModelDefinitions<T>(
    ...entities: Type<any>[]
  ): ModelDefinition[] {
    return entities.map((entity) => {
      const schema = SchemaFactory.createForClass<T>(entity);
      schema.set(
        'timestamps',
        schema.get('timestamps') ?? {
          createdAt: 'createdAt',
          updatedAt: 'lastModifiedAt',
        },
      );
      const toObject: ToObjectOptions = {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
          delete ret._id;
          Object.entries(ret).forEach(([key, value]) => {
            if (value instanceof mongoose.Types.ObjectId) {
              ret[key] = value.toString();
            }
          });

          const instance = plainToClass(entity, ret);
          ModelUtils.setAsEntity(instance);
          return ModelUtils.wrapProxy(instance);
        },
      };
      schema.set('toJSON', schema.get('toJSON') ?? toObject);
      schema.set('toObject', schema.get('toObject') ?? toObject);
      return { name: entity.name, schema };
    });
  }
}
