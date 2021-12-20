import {DateLike} from '@tk-ui/others/types';

export class ValidationUtil {
  /**
   * return true when the value is not null or undefined
   * @param value value
   */
  static isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }

  /**
   * return true when the value is valid float format
   * @param value value to check
   */
  static isFloat(value: string | number): boolean {
    const floatReg = /^(([+-])?(0|([1-9][0-9]*))(\.[0-9]+)?)$/gm;

    return !!floatReg.exec(typeof value === 'string' ? value : value.toString());
  }

  /**
   * return true when the value is valid integer format
   * @param value value to check
   */
  static isInteger(value: string | number): boolean {
    const integerReg = /^[+-]?[0-9]+$/gm;

    return !!integerReg.exec(typeof value === 'string' ? value : value.toString());
  }

  /**
   * return true when the value is valid date value
   * @param value value
   */
  static isValidDate(value: DateLike): boolean {
    return !isNaN(new Date(value).getTime());
  }

  /**
   * return true when the text is valid
   * @param value value
   */
  static isValidText(value: string): boolean {
    return this.isDefined(value) && !!value.trim();
  }
}
