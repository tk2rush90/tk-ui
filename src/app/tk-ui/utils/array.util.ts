export class ArrayUtil {
  /**
   * get summation of numbers array
   * @param numbers numbers array
   */
  static sum(numbers: number[]): number {
    if (numbers.length > 0) {
      return numbers.reduce(((previousValue, currentValue) => {
        return (previousValue || 0) + currentValue;
      }));
    } else {
      return 0;
    }
  }

  /**
   * get max number from numbers array
   * @param numbers numbers array
   */
  static max(numbers: number[]): number {
    if (numbers.length > 0) {
      return Math.max(...numbers);
    } else {
      return 0;
    }
  }
}
