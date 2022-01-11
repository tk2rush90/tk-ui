import {DatePipe} from '@angular/common';
import {DateLike, NumberLike} from '@tk-ui/others/types';
import {ValidationUtil} from '@tk-ui/utils/validation.util';
import {CalendarDate} from '@tk-ui/models/calendar-date';

const {isDefined} = ValidationUtil;

export class DateUtil {
  /**
   * return the formatted date by using Angular DatePipe
   * @param date date
   * @param format format string should follow Angular DatePipe format
   * @param locale format locale
   */
  static format(date: DateLike, format: string, locale = 'en-US'): string | null {
    const datePipe = new DatePipe(locale);

    return datePipe.transform(date, format);
  }

  /**
   * return the date list for specific year and month
   * @param options option to create calendar
   */
  static calendar(options?: CalendarOptions): CalendarDate[] {
    const {year, month} = this._getValuesFromCalendarOptions(options);

    let calendarStartDate: number | undefined;
    const start = 0;
    const monthStartDate = new Date(year, month, 1);
    const monthStartDayOfWeek = monthStartDate.getDay();

    // calculate starting date of calendar
    if (monthStartDayOfWeek > start) {
      calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - start)).getDate();
    } else if (monthStartDayOfWeek < start) {
      calendarStartDate = new Date(year, month, 1 - (5 - start + monthStartDayOfWeek)).getDate();
    } else {
      calendarStartDate = monthStartDate.getDate();
    }

    // create calendar dates
    const dates: CalendarDate[] = [];

    // create 42 dates
    while (dates.length < 42) {
      dates.push(new CalendarDate(new Date(year, month, calendarStartDate)));

      calendarStartDate++;
    }

    return dates;
  }

  /**
   * create completed calendar option
   * @param options option to create calendar
   */
  private static _getValuesFromCalendarOptions(options?: CalendarOptions): CompletedCalendarOptions {
    let {year, month} = options || {};
    const yearEmpty = !isDefined(year);
    const monthEmpty = !isDefined(month);

    // fill empty year and month with current date
    if (yearEmpty || monthEmpty) {
      const date = new Date();

      if (yearEmpty) {
        year = date.getFullYear();
      }

      if (monthEmpty) {
        month = date.getMonth();
      }
    }

    return {
      year: year as number,
      month: month as number,
    };
  }
}

/**
 * option to create calendar dates
 */
export interface CalendarOptions {
  /**
   * set the year to get calendar dates
   * default value is current year
   */
  year?: NumberLike;

  /**
   * set the month to get calendar dates
   * default value is current month
   * starts from `0`
   */
  month?: NumberLike;

  /**
   * set the starting day of week
   * default value is `0`
   */
  startingDayOfWeek?: number;
}

/**
 * calendar option with non-empty values
 */
export interface CompletedCalendarOptions {
  year: number;
  month: number;
}
