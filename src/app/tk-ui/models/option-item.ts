/**
 * option item for select or select-like
 */
export class OptionItem<T> {
  /**
   * label for option
   */
  label: string;

  /**
   * value for option
   */
  value: T;

  constructor(label: string, value: T) {
    this.label = label;
    this.value = value;
  }
}
