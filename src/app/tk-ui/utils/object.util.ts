export class ObjectUtil {
  /**
   * set object value with point separated property string
   * @param obj object
   * @param property property
   * @param value value
   */
  static setObjectValue(obj: any, property: string, value: any): void {
    let target: any = obj;
    const properties = property.split('.');

    properties.forEach((p, i) => {
      if (i !== properties.length - 1) {
        if (!target[p]) {
          target[p] = {};
        }

        target = target[p];
      } else {
        target[p] = value;
      }
    });
  }

  /**
   * return specific value of the data
   * @param data object data
   * @param property data property string
   */
  static getObjectValue<T>(data: any, property: string): T {
    const keys = property.split('.');
    const lastIndex = keys.length - 1;
    let target = data;

    keys.forEach((key, index) => {
      target = target[key];

      if (index !== lastIndex && !target) {
        target = {} as any;
      }
    });

    return target;
  }

  /**
   * change none array items to array
   * @param items items
   */
  static noneArrayToArray<T>(items: any): T[] {
    if (!items.length) {
      return items;
    }

    const list = [];

    for (const i of items) {
      list.push(i);
    }

    return list;
  }
}
