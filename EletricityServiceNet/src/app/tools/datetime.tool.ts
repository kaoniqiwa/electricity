import { TimeUnit } from '../enums/time-unit.enum';

export class DateTimeTool {
  static TimeUnit(unit: TimeUnit, date: Date, firstDay = 1) {
    switch (unit) {
      case TimeUnit.Month:
        return this.allMonth(date);
      case TimeUnit.Week:
        return this.allWeek(date, firstDay);
      case TimeUnit.Hour:
      case TimeUnit.Day:
      default:
        return this.allDay(date);
    }
  }

  static allMonth(date: Date) {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    duration.begin = new Date(date.getFullYear(), date.getMonth(), 1);
    let next = new Date(duration.begin.getTime());
    next.setMonth(next.getMonth() + 1);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }
  static allDay(date: Date) {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    duration.begin = new Date(year, month, day);
    let next = new Date(duration.begin.getTime());
    next.setDate(next.getDate() + 1);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }
  static allWeek(date: Date, firstDay = 0) {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let weekDay = date.getDay() - firstDay;

    let begin = new Date(year, month, day);
    begin.setDate(begin.getDate() - weekDay);
    begin.toISOString;
    duration.begin = begin;
    let next = new Date(begin.getTime());
    next.setDate(next.getDate() + 7);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }

  static beforeAndAfter(date: Date, seconds: number = 30) {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };

    let begin = new Date(date.getTime());
    begin.setSeconds(begin.getSeconds() - seconds);
    duration.begin = new Date(begin.getTime());

    let end = new Date(date.getTime());
    end.setSeconds(end.getSeconds() + seconds);
    duration.end = end;

    return duration;
  }
}
