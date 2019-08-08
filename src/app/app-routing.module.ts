import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BookingComponent} from './booking/booking.component';
import {AddBookingComponent} from './add-booking/add-booking.component';


const routes: Routes = [
  {path: 'booking', component: BookingComponent},
  {path: 'add-booking', component: AddBookingComponent},
  {path: '', pathMatch: 'full', redirectTo: 'booking'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
