export class CalendarDate {
  /**
   * year of calendar date
   */
  year: number;

  /**
   * month of calendar date
   */
  month: number;

  /**
   * date of calendar date
   */
  date: number;

  /**
   * day of week of calendar date
   */
  dayOfWeek: number;

  /**
   * original date object
   */
  originalObject: Date;

  /**
   * create calendar date model
   * @param date date
   */
  constructor(date: Date) {
    this.originalObject = date;
    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.date = date.getDate();
    this.dayOfWeek = date.getDay();
  }
}
