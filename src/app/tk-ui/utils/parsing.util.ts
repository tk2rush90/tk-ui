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

  /**
   * parse hex string to hsl numbers
   * @param hex hex
   */
  static hexToHsl(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const hsl = [];

    if (result) {
      const r = parseInt(result[1], 16) / 255;
      const g = parseInt(result[2], 16) / 255;
      const b = parseInt(result[3], 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);

      let h = 0;
      let s = 0;
      let l = (max + min) / 2;

      if (max !== min) {
        const distance = max - min;

        s = l > 0.5 ? distance / (2 - max - min) : distance / (max + min);
        switch (max) {
          case r: {
            h = (g - b) / distance + (g < b ? 6 : 0);
            break;
          }

          case g: {
            h = (b - r) / distance + 2;
            break;
          }

          case b: {
            h = (r - g) / distance + 4;
            break;
          }
        }

        h /= 6;
      }

      s = Math.round(s * 100);
      l = Math.round(l * 100);
      h = Math.round(360 * h);

      hsl.push(h, s, l);
    }

    return hsl;
  }

  /**
   * parse hsl number array to hex
   * @param hsl hsl
   */
  static hslToHex(hsl: number[]): string {
    let [h, s, l] = hsl;

    l /= 100;

    const a = s * Math.min(l, 1 - l) / 100;

    // converter function
    const converter = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${converter(0)}${converter(8)}${converter(4)}`;
  }

  /**
   * hex to rgb array
   * @param hex hex
   */
  static hexToRgb(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = [];

    if (result) {
      const r = Math.round(parseInt(result[1], 16));
      const g = Math.round(parseInt(result[2], 16));
      const b = Math.round(parseInt(result[3], 16));

      rgb.push(r, g, b);
    }

    return rgb;
  }

  /**
   * rgb to hex string
   * @param rgb rgb
   */
  static rgbToHex(rgb: number[]): string {
    const [r, g, b] = rgb;

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  }
}
