export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class MathUtil {
  /**
   * degree to radian
   * @param deg degree
   */
  static degreeToRadian(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * radian to degree
   * @param rad radian
   */
  static radianToDegree(rad: number): number {
    return rad * (180 / Math.PI);
  }

  /**
   * return percent as radian
   * @param percent percent from `0` to `100`
   */
  static percentToRadian(percent: number): number {
    return this.degreeToRadian(this.percentToDegree(percent));
  }

  /**
   * return percent as degree
   * @param percent percent from `0` to `100`
   */
  static percentToDegree(percent: number): number {
    return 360 * (percent / 100);
  }

  /**
   * get coordinates for point on arc
   * @param cx arc center x
   * @param cy arc center y
   * @param r radius
   * @param angle angle in degree
   */
  static getArcPointCoordinates(cx: number, cy: number, r: number, angle: number): [number, number] {
    const rad = this.degreeToRadian(angle);

    return [cx + Math.cos(rad) * r, cy + Math.sin(rad) * r];
  }

  /**
   * return circle round length
   * @param radius radius
   */
  static getCircleRoundLength(radius: number): number {
    return radius * 2 * Math.PI;
  }

  /**
   * return arc length by start angle to end angle
   * @param radius radius
   * @param start start angle in degree
   * @param end end angle in degree
   */
  static getArcLength(radius: number, start: number, end: number): number {
    return this.getCircleRoundLength(radius) * (Math.abs(end - start) / 360);
  }

  /**
   * return `true` when `container` rect contains `rect` inside
   * @param container container rect
   * @param rect rect
   */
  static rectContainsRect(container: Rect, rect: Rect): boolean {
    const containerX2 = container.x + container.width;
    const containerY2 = container.y + container.height;
    const rectX2 = rect.x + rect.width;
    const rectY2 = rect.y + rect.height;

    const xContained = (container.x <= rect.x && containerX2 >= rect.x) || (container.x <= rectX2 && containerX2 >= rectX2);
    const yContained = (container.y <= rect.y && containerY2 >= rect.y) || (container.y <= rectY2 && containerY2 >= rectY2);

    return xContained && yContained;
  }
}
