import {ObjectUtil} from '@tk-ui/utils/object.util';

// sort order
export type SortOrder = 'asc' | 'desc';

/**
 * sort column info
 */
export interface SortColumn<T> {
  // property name
  property: keyof T;
  // order
  order: SortOrder;
  // value type
  // default is string
  type: 'string' | 'date' | 'number';
}

export class SortUtil {
  /**
   * sort data as ascending
   * @param a data 1
   * @param b data 2
   */
  static sortMethodAsc<T>(a: T, b: T): number {
    return a === b ? 0 : a > b ? 1 : -1;
  }

  /**
   * sort data with order
   * @param order sort order
   */
  static sortMethodWithOrder<T>(order: 'asc' | 'desc'): any {
    if (order === undefined || order === 'asc') {
      return this.sortMethodAsc;
    } else {
      return (a: T, b: T) => {
        return -this.sortMethodAsc(a, b);
      };
    }
  }

  /**
   * sort data with ordered column
   * @param property property string
   * @param order sort order
   * @param type value type
   */
  static sortMethodWithOrderByColumn<T>({property, order, type = 'string'}: SortColumn<T>): any {
    const sortMethod = this.sortMethodWithOrder(order);

    return (a: T, b: T) => {
      let v1: any = ObjectUtil.getObjectValue<T>(a, property as any);
      let v2: any = ObjectUtil.getObjectValue<T>(b, property as any);

      switch (type) {
        case 'string': {
          v1 = v1 || '';
          v2 = v2 || '';

          return sortMethod(v1, v2);
        }

        case 'number': {
          v1 = parseFloat(v1 as string);
          v2 = parseFloat(v2 as string);

          return sortMethod(v1, v2);
        }

        case 'date': {
          v1 = new Date(v1).getTime();
          v2 = new Date(v2).getTime();

          return sortMethod(v1, v2);
        }

        // handle default as string
        default: {
          throw new Error(`Invalid value type: '${type}'`);
        }
      }
    };
  }

  /**
   * sort data with ordered multiple columns
   * @param sortedColumns sorted column list
   */
  static sortMethodWithOrderMultiColumn<T>(sortedColumns: SortColumn<T>[]): any {
    const sortMethodsForColumn = (sortedColumns || []).map((item) =>
      this.sortMethodWithOrderByColumn(item),
    );

    return (a: T, b: T) => {
      let sorted = 0;
      let index = 0;

      while (sorted === 0 && index < sortMethodsForColumn.length) {
        sorted = sortMethodsForColumn[index++](a, b);
      }

      return sorted;
    };
  }

}
