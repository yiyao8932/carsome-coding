import { Component, OnInit } from '@angular/core';
import { addWeeks, addDays } from 'date-fns';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AvailableTimeSlot } from 'src/app/classes/available-time-slot';
import { GenerateTimeListService } from 'src/app/services/generate-time-list.service';

@Component({
  selector: 'app-appointment-main',
  templateUrl: './appointment-main.component.html',
  styleUrls: ['./appointment-main.component.scss']
})
export class AppointmentMainComponent implements OnInit {
  myForm: FormGroup;

  currentDate: Date;
  minDate: Date;
  maxDate: Date;
  MIN_HOUR = 9;
  MAX_HOUR = 17;
  MAX_MINUTE = 30;

  timeList: AvailableTimeSlot[];
  timeListLoading: boolean = false;

  slotsAvailable;

  success: boolean = false;

  userBookingId: number;

  constructor(private httpService: HttpServiceService,
    private generateTimeListService: GenerateTimeListService,
    private fb: FormBuilder) {
    this.minDate = new Date().getHours() >= this.MAX_HOUR ? addDays(new Date(), 1) : new Date(); // For datepicker. Switch to next day after 5pm
    this.currentDate = new Date();
    this.maxDate = addWeeks(new Date(), 3); // For datepicker
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      date: '',
      time: ''
    })
  }

  /**
   * Fiter out Sunday option
   * @param d 
   */
  dateFilter(d: Date | null): boolean {
    const day = (d || new Date()).getDay();
    return day !== 0;
  }

  /**
   * Generate a list of times available for booking
   * @param event 
   */
  generateTimeList(event: MatDatepickerInputEvent<Date>): void {
    this.timeList = null;
    this.slotsAvailable = null;
    this.success = false;
    this.timeListLoading = true;

    this.httpService.getAvailableBookings().subscribe((res: any[]) => {
      let bookings = res; // get bookings from db
      let bookingsMapping = new Map();

      bookings.forEach(each => {
        if (bookingsMapping.has(new Date(each.time).toString())) {
          const temp = bookingsMapping.get(new Date(each.time).toString());
          bookingsMapping.set(new Date(each.time).toString(), temp + 1);
        }
        else {
          bookingsMapping.set(new Date(each.time).toString(), 1);
        }
      }); // create a Map object to get the count of each booking

      let allTimeSlots = this.generateTimeListService.generateTimeListService(event.value).map(each => {
        if (bookingsMapping.has(new Date(each.time).toString())) {
          const count = bookingsMapping.get(new Date(each.time).toString());
          const temp = {
            time: new Date(each.time),
            numberOfSlots: each.numberOfSlots - count
          };
          return temp;
        }
        else {
          return each;
        }
      
      }); // subtract the unavailable slots of each booking

      allTimeSlots = allTimeSlots.filter(each => {
        return each.numberOfSlots != 0;
      });
      
      this.timeList = allTimeSlots;
      this.timeListLoading = false;
    });
  }

  /**
   * Extract the number of slots from the time slot object
   * @param value 
   */
  getNumberOfSlots(value) {
    this.slotsAvailable = value.numberOfSlots;
  }

  /**
   * Handler for the form when it is being submitted
   */
  onSubmit() {
    const time = {
      time: this.myForm.get('time').value.time
    };
    this.httpService.placeBooking(time).subscribe((res) => {
      this.success = true;
      this.timeList = null;
      this.slotsAvailable = null;
      this.myForm.reset();
      this.userBookingId = res['id'];
    })
  }
}
