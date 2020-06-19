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

  slotsAvailable;

  success: boolean = false;

  constructor(private httpService: HttpServiceService,
    private generateTimeListService: GenerateTimeListService,
    private fb: FormBuilder) {
    this.minDate = new Date().getHours() >= this.MAX_HOUR ? addDays(new Date(), 1) : new Date();
    this.currentDate = new Date();
    this.maxDate = addWeeks(new Date(), 3);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      date: '',
      time: ''
    })
  }

  dateFilter(d: Date | null): boolean {
    const day = (d || new Date()).getDay();
    return day !== 0;
  }

  generateTimeList(event: MatDatepickerInputEvent<Date>): void {
    this.timeList = null;
    this.slotsAvailable = null;
    this.success = false;
    this.httpService.getAvailableBookings().subscribe((res: any[]) => {
      let bookings = res;
      let bookingsMapping = new Map();
      bookings.forEach(each => {
        if (bookingsMapping.has(new Date(each.time).toString())) {
          const temp = bookingsMapping.get(new Date(each.time).toString());
          bookingsMapping.set(new Date(each.time).toString(), temp + 1);
        }
        else {
          bookingsMapping.set(new Date(each.time).toString(), 1);
        }
      })
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
      })

      allTimeSlots = allTimeSlots.filter(each => {
        return each.numberOfSlots != 0;
      });
      this.timeList = allTimeSlots;
    });
  }

  selectedDate(value) {
    this.slotsAvailable = value.numberOfSlots;
  }

  onSubmit() {
    const time = {
      time: this.myForm.get('time').value.time
    };
    this.httpService.placeBooking(time).subscribe((res) => {
      this.success = true;
      this.timeList = null;
      this.slotsAvailable = null;
      this.myForm.reset();
    })
  }
}
