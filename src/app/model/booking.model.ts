import {ProcessDatesModel} from './process-dates.model';

export class BookingModel {
  id: string;
  patientName: string;
  dates: ProcessDatesModel;
  createdAt: number;
  updatedAt: number;
}
