import { Injectable } from '@angular/core';
import { AvailableTimeSlot } from '../classes/available-time-slot';
import { addMinutes, getDay, set } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class GenerateTimeListService {

  MIN_HOUR = 9;
  MAX_HOUR = 17;
  MAX_MINUTE = 30;

  constructor() { }

  generateTimeListService = (time) => {
    let availableTimeList = [];
    let currentTime = set(new Date(), {
      milliseconds: 0,
      seconds: 0
    });
    if (new Date(time).getDay() == currentTime.getDay() && currentTime.getHours() >= this.MIN_HOUR) {
      currentTime.setHours(currentTime.getHours() + 1)
      currentTime.setMinutes(0);
    }
    else {
      currentTime = new Date(time);
      currentTime.setHours(this.MIN_HOUR);
    }

    availableTimeList.push(currentTime);

    while (currentTime.getHours() < this.MAX_HOUR || currentTime.getMinutes() < this.MAX_MINUTE) {
      currentTime = addMinutes(currentTime, 30);
      availableTimeList.push(currentTime);
    }

    let allTimeSlots = [];
    let maxSlots = getDay(currentTime) == 0 || getDay(currentTime) == 6 ? 4 : 2;
    availableTimeList.forEach(each => {
      allTimeSlots.push(new AvailableTimeSlot(each, maxSlots));
    });

    return allTimeSlots;
  }
}
