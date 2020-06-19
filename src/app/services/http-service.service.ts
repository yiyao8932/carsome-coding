import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) {

  }

  getAvailableBookings() {
    return this.http.get(environment.backendUrl + "/bookings");
  }

  placeBooking(data) {
    return this.http.post(environment.backendUrl + "/place-booking", data);
  }
}
