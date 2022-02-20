import {DatePipe} from '@angular/common';
import {DateLike, NumberLike} from '@tk-ui/others/types';
import {CalendarDate} from '@tk-ui/models/calendar-date';
import {ParsingUtil} from '@tk-ui/utils/parsing.util';

export class DateUtil {
  /**
   * Parse the mm/dd/yy string date to milliseconds.
   * @param date Date string formatted with mm/dd/yy.
   */
  static parse(date: string): Date | undefined {
    // Remove all slashes.
    date = date.replace(/\//g, '');

    const reg = /^\d{6}$/;

    if (reg.test(date)) {
      let m: NumberLike = date.substring(0, 2);
      let d: NumberLike = date.substring(2, 4);
      let y: NumberLike = date.substring(4, 6);

      m = ParsingUtil.toInteger(m);
      d = ParsingUtil.toInteger(d);
      y = ParsingUtil.toInteger(y);

      return new Date(2000 + y, m - 1, d);
    } else {
      return;
    }
  }

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
    // Today's date to set initial `year`, `month` of calendar options.
    const date = new Date();
    const {year = date.getFullYear(), month = date.getMonth(), startingDayOfWeek = 0} = (options || {}) as CompletedCalendarOptions;

    let calendarStartDate: Date;
    const monthStartDate = new Date(year, month, 1);
    const monthStartDayOfWeek = monthStartDate.getDay();

    // calculate starting date of calendar
    if (monthStartDayOfWeek > startingDayOfWeek) {
      calendarStartDate = new Date(year, month, 1 - (monthStartDayOfWeek - startingDayOfWeek));
    } else if (monthStartDayOfWeek < startingDayOfWeek) {
      // if `startingDayOfWeek` is `3` and `monthStartDayOfWeek` is `0`,
      // Then, we can imagine following figure of calendar:
      //
      // Wed Thu Fri Sat Sun Mon Tue
      // 27  28  29  30  1   2   3   : Dates
      // 3   4   5   6   0   1   2   : Day of Weeks
      //
      // In this case, to calculate the start date of calendar,
      //
      // Wed Thu Fri Sat Sun Mon Tue
      // 27  28  29  30  1   2   3   : Dates
      // 3   4   5   6   0   1   2   : Day of Weeks
      // └----------┘└┘
      //       a        b
      //
      // reduce (a + b) from the `monthStartDayOfWeek`.
      // So the formula is (6 - `startingDayOfWeek` + `monthStartDayOfWeek` + 1);
      calendarStartDate = new Date(year, month, 1 - (6 - startingDayOfWeek + monthStartDayOfWeek + 1));
    } else {
      calendarStartDate = monthStartDate;
    }

    // create calendar dates
    const dates: CalendarDate[] = [];
    const calendarStartYear = calendarStartDate.getFullYear();
    const calendarStartMonth = calendarStartDate.getMonth();
    let calendarDate = calendarStartDate.getDate();

    // create 42 dates
    while (dates.length < 42) {
      dates.push(new CalendarDate(new Date(calendarStartYear, calendarStartMonth, calendarDate)));

      calendarDate++;
    }

    return dates;
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
  startingDayOfWeek: number;
}
