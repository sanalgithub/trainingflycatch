import mongoose, { Query } from 'mongoose';
import { constants } from '@app/common/database/constants';
import { Pageable } from '@app/common/database/dto/pageable';
import { Sort } from '@app/common/database/dto/sort';
import { SortOrder } from '@app/common/database/dto/sort-order';
import { BaseModel } from '@app/common/database/models/base.model';
export class ModelUtils {
  public static isEntity<T extends BaseModel>(entity: T): boolean {
    return (
      (Object.getOwnPropertyDescriptor(entity, constants.IS_ENTITY)
        ?.value as boolean) ?? false
    );
  }

  public static setAsEntity<T extends BaseModel>(entity: T): void {
    Object.defineProperty(entity, constants.IS_ENTITY, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: true,
    });
  }

  public static isModified<T extends BaseModel>(entity: T): boolean {
    return (
      (Object.getOwnPropertyDescriptor(entity, constants.IS_MODIFIED)
        ?.value as boolean) ?? false
    );
  }

  public static setModified<T extends BaseModel>(entity: T): void {
    Object.defineProperty(entity, constants.IS_MODIFIED, {
      configurable: false,
      enumerable: false,
      writable: false,
      value: true,
    });
  }

  public static wrapProxy<T extends BaseModel>(entity: T): T {
    return new Proxy<T>(entity, {
      get: (target, property, reciever) => {
        if (property === '_id') {
          return Reflect.get(target, 'id', reciever);
        }
        return Reflect.get(target, property, reciever);
      },
      set: (target, property, value, reciever) => {
        if (Reflect.get(target, property, reciever) !== value) {
          this.setModified(entity);
        }
        return Reflect.set(target, property, value, reciever);
      },
    });
  }

  public static populate(query: Query<any, any>, ...joins: any[]): void {
    if (joins && joins.length !== 0) {
      joins.forEach((join) => query.populate(join as string));
    }
  }

  public static generateSortQuery(
    sorts: Sort<any>[] | undefined,
  ): Record<string, mongoose.SortOrder> | undefined {
    if (!sorts || sorts.length === 0) return undefined;
    return sorts.reduce((previous, current) => {
      previous[current.key as string] =
        current.order === SortOrder.DESC ? -1 : 1;
      return previous;
    }, {} as Record<string, mongoose.SortOrder>);
  }

  public static generateSortQueryFromPageable(
    pageable: Pageable,
  ): Record<string, mongoose.SortOrder> | undefined {
    if (pageable.sort && pageable.sort.length > 0) {
      const sorts =
        typeof pageable.sort === 'string'
          ? Sort.of(pageable.sort)
          : pageable.sort;
      return ModelUtils.generateSortQuery(sorts);
    }
    return undefined;
  }
}
