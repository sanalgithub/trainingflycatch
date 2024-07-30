import { constants } from '@app/common/database/constants';
import { SortOrder } from '@app/common/database/dto/sort-order';

export class Sort<T> {
  private constructor(readonly key: keyof T, readonly order: SortOrder) {}

  static of<E>(key: keyof E, order: SortOrder): Sort<E>[] | undefined;
  static of<E>(sortString: string): Sort<E>[] | undefined;
  static of<E>(arg1: string, arg2?: SortOrder): Sort<E>[] | undefined {
    if (!arg1) {
      return undefined;
    }
    if (!arg2 && arg1.match(constants.SORT_STRING_PATTERN)) {
      return (arg1 as string).split(',').map((sort) => {
        const [field, order] = sort.split(':');
        return new Sort<E>(
          field as keyof E,
          SortOrder[order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'],
        );
      });
    }
    return [new Sort<E>(arg1 as keyof E, arg2 ?? SortOrder.ASC)];
  }
}
