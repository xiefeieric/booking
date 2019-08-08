import * as moment from 'moment';
import {WorkdayFormatEnum} from '../enums/workday-format.enum';

export class DateUtil {

  public static addWorkdays(date: Date, days: number, format: WorkdayFormatEnum): Date {
    const flag = days / Math.abs(days);
    const updatedDate = moment(date).add(Math.floor(Math.abs(days) / format) * 7 * flag, 'days');
    let remainDays = days % format;
    while (remainDays !== 0) {
      updatedDate.add(flag, 'days');
      if (format === WorkdayFormatEnum.FOUR) {
        if (updatedDate.isoWeekday() !== 5 && updatedDate.isoWeekday() !== 6 && updatedDate.isoWeekday() !== 7) {
          remainDays -= flag;
        }
      } else {
        if (updatedDate.isoWeekday() !== 6 && updatedDate.isoWeekday() !== 7) {
          remainDays -= flag;
        }
      }
    }

    return updatedDate.toDate();
  }
}
