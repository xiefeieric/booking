import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {ProcessDatesModel} from '../model/process-dates.model';
import {ClrModal} from '@clr/angular';
import {BookingModel} from '../model/booking.model';
import {BookingService} from '../services/booking.service';

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

  constructor(public bookingService: BookingService) {
  }

  ngOnInit() {
    this.minTreatDay = this.bookingService.getMinAvailableTreatDay();
  }

  public dateChange(date: Date) {
    if (!date) {
      this.processingDays = null;
      this.processList = [];
      return;
    }

    this.bookingService.getProcessingDays(date)
      .then((value: string) => {
        this.processingDays = JSON.parse(value).processingDays as ProcessDatesModel;
        this.processList = this.bookingService.addProcessDaysToList(this.processingDays);
      });
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
    await this.bookingService.saveBooking(booking);
  }

  public dateFilter = (d: Date): boolean => {
    const day = d.getDay();
    return day !== 0 && day !== 6;
  };
}
