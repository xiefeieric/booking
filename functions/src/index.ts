import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as moment from 'moment';

const corsHandler = cors({origin: true});
const currentDate = new Date();

class ProcessDatesModel {
  public deliverCollectionKitStart: Date = currentDate;
  public deliverCollectionKitEnd: Date = currentDate;
  public trasnport1: Date = currentDate;
  public surgeryStart: Date = currentDate;
  public surgeryEnd: Date = currentDate;
  public trasnport2: Date = currentDate;
  public specimenProcessStart: Date = currentDate;
  public specimenProcessEnd: Date = currentDate;
  public trasnport3: Date = currentDate;
  public manufacturingStart: Date = currentDate;
  public manufacturingEnd: Date = currentDate;
  public trasnport4: Date = currentDate;
  public treatDayStart: Date = currentDate;
  public treatDayEnd: Date = currentDate;
}

enum WorkdayFormatEnum {
  FOUR = 4,
  FIVE = 5
}

const addWorkdays = (date: Date, days: number, format: WorkdayFormatEnum): Date => {
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
};

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const getProcessingDays = functions.https.onRequest((request, response) => {
  // tslint:disable-next-line:no-empty
  corsHandler(request, response, () => {
  });
  const dateStr = request.body.data;
  const date = new Date(JSON.parse(dateStr));
  let datePointer = date;
  const processingDaysModel = new ProcessDatesModel();
  processingDaysModel.trasnport4 = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.trasnport4;
  processingDaysModel.manufacturingEnd = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.manufacturingEnd;
  processingDaysModel.manufacturingStart = addWorkdays(datePointer, -6, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.manufacturingStart;
  processingDaysModel.trasnport3 = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.trasnport3;
  processingDaysModel.specimenProcessEnd = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.specimenProcessEnd;
  processingDaysModel.specimenProcessStart = addWorkdays(datePointer, -14, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.specimenProcessStart;
  processingDaysModel.trasnport2 = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.trasnport2;
  processingDaysModel.surgeryEnd = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  processingDaysModel.surgeryStart = processingDaysModel.surgeryEnd;
  datePointer = processingDaysModel.surgeryStart;
  processingDaysModel.trasnport1 = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  datePointer = processingDaysModel.trasnport1;
  processingDaysModel.deliverCollectionKitEnd = addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
  processingDaysModel.deliverCollectionKitStart = processingDaysModel.deliverCollectionKitEnd;
  processingDaysModel.treatDayStart = date;
  processingDaysModel.treatDayEnd = date;
  response.send({data: JSON.stringify({processingDays: processingDaysModel})});
});
