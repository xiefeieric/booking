import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {DateUtil} from '../util/date-util';
import {WorkdayFormatEnum} from '../enums/workday-format.enum';
import {ProcessDatesModel} from '../model/process-dates.model';
import {ClrModal} from '@clr/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {BookingModel} from '../model/booking.model';
import {Router} from '@angular/router';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
})
export class AddBookingComponent implements OnInit {

  @ViewChild('clrModal', {static: true})
  public clrModal: ClrModal;

  public minTreatDay: Date;
  public processList: { title: string, content: string }[] = [];
  public modalOpened = false;
  public patientName = 'David Clayton';
  public processingDays: ProcessDatesModel;

  constructor(public db: AngularFirestore,
              public fns: AngularFireFunctions,
              public router: Router) {
  }

  ngOnInit() {
    this.minTreatDay = DateUtil.addWorkdays(moment().add(7, 'weeks').toDate(), 1, WorkdayFormatEnum.FIVE);
  }

  public dateChange(date: Date) {
    if (!date) {
      this.processingDays = null;
      this.processList = [];
      return;
    }

    this.getProcessingDays(date)
      .then((value: string) => {
        this.processingDays = JSON.parse(value).processingDays as ProcessDatesModel;
        this.processList = this.addProcessDaysToList(this.processingDays);
      });
  }

  private async getProcessingDays(date: Date): Promise<string> {
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

  public addBooking() {
    this.clrModal.open();
  }

  public cancelConfirmation() {
    this.clrModal.close();
  }

  public async submitBooking() {
    const booking = new BookingModel();
    booking.patientName = this.patientName;
    booking.dates = this.processingDays;
    const timeStamp = moment().valueOf();
    booking.createdAt = timeStamp;
    booking.updatedAt = timeStamp;
    await this.db.collection('bookings').add(JSON.parse(JSON.stringify(booking)));
    await this.router.navigateByUrl('booking');
  }

  private addProcessDaysToList(processingDays: ProcessDatesModel) {
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

  private parseDate(str: string): Date {
    if (!str) {
      return;
    }
    return new Date(str);
  }

  public dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  }
}
