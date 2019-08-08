import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {BookingModel} from '../model/booking.model';
import {ClrModal} from '@clr/angular';
import {BookingService} from '../services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  public bookings: Observable<BookingModel[]>;
  public modalOpened = false;
  public selectedBooking: BookingModel;

  @ViewChild('clrModal', {static: true})
  public clrModal: ClrModal;

  constructor(public db: AngularFirestore, public bookingService: BookingService) {
  }

  ngOnInit() {
    this.bookings = this.bookingService.fetchBookings();
  }

  public showBookingInfo(booking: BookingModel) {
    this.selectedBooking = booking;
    this.clrModal.open();
  }

}
