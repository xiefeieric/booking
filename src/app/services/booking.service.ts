import {Injectable} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {BookingModel} from '../model/booking.model';
import {Observable} from 'rxjs';
import {DateUtil} from '../util/date-util';
import * as moment from 'moment';
import {WorkdayFormatEnum} from '../enums/workday-format.enum';
import {AngularFireFunctions} from '@angular/fire/functions';
import {ProcessDatesModel} from '../model/process-dates.model';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class BookingService {

  constructor(public db: AngularFirestore,
              public fns: AngularFireFunctions,
              public router: Router) {
  }

  public getMinAvailableTreatDay(): Date {
    return DateUtil.addWorkdays(moment().add(7, 'weeks').toDate(), 1, WorkdayFormatEnum.FIVE);
  }

  public async saveBooking(booking: BookingModel) {
    await this.db.collection('bookings').add(JSON.parse(JSON.stringify(booking)));
    await this.router.navigateByUrl('booking');
  }

  public fetchBookings(): Observable<BookingModel[]> {
    return this.db.collection('bookings', ref =>
      ref.orderBy('dates.treatDayStart', 'asc').limit(10)
    )
      .snapshotChanges()
      .pipe(
        map((bookings: DocumentChangeAction<BookingModel>[]) => {
          return bookings.map((booking: DocumentChangeAction<BookingModel>) => {
            const bookingWithId: BookingModel = booking.payload.doc.data() as BookingModel;
            bookingWithId.id = booking.payload.doc.id;
            return bookingWithId;
          });
        })
      );
  }

  public addProcessDaysToList(processingDays: ProcessDatesModel) {
    const deliverCollectionKit = {
      title: 'Deliver Collection Kit',
      content: moment(this.parseDate(processingDays.deliverCollectionKitStart)).format('DD/MMM/YYYY').toString()
    };
    const surge = {
      title: 'Surgery/Apheresis',
      content: moment(this.parseDate(processingDays.surgeryStart)).format('DD/MMM/YYYY').toString()
    };
    const specimenProcessing = {
      title: 'Specimen Processing',
      content: `${moment(this.parseDate(processingDays.specimenProcessStart)).format('DD/MMM/YYYY').toString()} - ${moment(this.parseDate(processingDays.specimenProcessEnd)).format('DD/MMM/YYYY').toString()}`
    };
    const manufacturing = {
      title: 'Manufacturing',
      content: `${moment(this.parseDate(processingDays.manufacturingStart)).format('DD/MMM/YYYY').toString()} - ${moment(this.parseDate(processingDays.manufacturingEnd)).format('DD/MMM/YYYY').toString()}`
    };
    const treat = {
      title: 'Infusion/Treatment Day',
      content: moment(this.parseDate(processingDays.treatDayStart)).format('DD/MMM/YYYY').toString()
    };

    return [deliverCollectionKit, surge, specimenProcessing, manufacturing, treat];
  }

  public async getProcessingDays(date: Date): Promise<string> {
    const callable = this.fns.httpsCallable('getProcessingDays');
    try {
      return await callable(JSON.stringify(date)).toPromise();
    } catch (e) {
      console.error('Firebase function failed!', e);
    }

    // let datePointer = date;
    // const processingDaysModel = new ProcessDatesModel();
    // processingDaysModel.trasnport4 = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.trasnport4;
    // processingDaysModel.manufacturingEnd = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.manufacturingEnd;
    // processingDaysModel.manufacturingStart = DateUtil.addWorkdays(datePointer, -6, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.manufacturingStart;
    // processingDaysModel.trasnport3 = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.trasnport3;
    // processingDaysModel.specimenProcessEnd = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.specimenProcessEnd;
    // processingDaysModel.specimenProcessStart = DateUtil.addWorkdays(datePointer, -14, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.specimenProcessStart;
    // processingDaysModel.trasnport2 = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.trasnport2;
    // processingDaysModel.surgeryEnd = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // processingDaysModel.surgeryStart = processingDaysModel.surgeryEnd;
    // datePointer = processingDaysModel.surgeryStart;
    // processingDaysModel.trasnport1 = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // datePointer = processingDaysModel.trasnport1;
    // processingDaysModel.deliverCollectionKitEnd = DateUtil.addWorkdays(datePointer, -1, WorkdayFormatEnum.FOUR);
    // processingDaysModel.deliverCollectionKitStart = processingDaysModel.deliverCollectionKitEnd;
    // processingDaysModel.treatDayStart = date;
    // processingDaysModel.treatDayEnd = date;
    //
    // return processingDaysModel;
  }

  private parseDate(str: string): Date {
    if (!str) {
      return;
    }
    return new Date(str);
  }
}
