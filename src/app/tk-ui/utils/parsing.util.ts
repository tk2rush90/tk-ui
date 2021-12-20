import {NumberLike} from '@tk-ui/others/types';

export class ParsingUtil {
  /**
   * parse non integer to integer
   * @param value value to parse
   * @example
   * ParsingUtil.toInteger('3'); // 3
   * ParsingUtil.toInteger('3,000'); // 3000
   */
  static toInteger(value?: NumberLike): number {
    let int: number | undefined;

    if (typeof value === 'string') {
      int = parseInt(value.replace(/,/g, ''), undefined);
    } else if (typeof value === 'number') {
      int = Math.round(value);
    }

    // to prevent `NaN` or `undefined`
    if (!int) {
      int = 0;
    }

    return int;
  }

  /**
   * parse non float to float
   * @param value value to parse
   * @example
   * ParsingUtil.toFloat('0.34'); // 0.34
   * ParsingUtil.toFloat('1,000.50'); // 1000.50
   */
  static toFloat(value?: NumberLike): number {
    let float: number | undefined;

    if (typeof value === 'string') {
      float = parseFloat(value.replace(/,/g, ''));
    } else if (typeof value === 'number') {
      float = value;
    }

    // to prevent `NaN` or `undefined`
    if (!float) {
      float = 0;
    }

    return float;
  }

  /**
   * to limited number with minimum and maximum values
   * @param value value to limit
   * @param min minimum value
   * @param max maximum value
   */
  static toLimitedNumber(value: number, min: number | undefined, max: number | undefined): number {
    if (min !== undefined) {
      value = Math.max(min, value);
    }

    if (max !== undefined) {
      value = Math.min(max, value);
    }

    return value;
  }

  /**
   * array buffer to base64 url
   * @param arrayBuffer array buffer to parse
   */
  static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);

    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
  }
}
