import { TestBed } from '@angular/core/testing';

import { HttpServiceService } from './http-service.service';
import { HttpClientTestingModule,
  HttpTestingController } from '@angular/common/http/testing';
  import { HttpClient, HttpErrorResponse } from '@angular/common/http';

fdescribe('HttpServiceService', () => {
  let httpTestingController: HttpTestingController;
  let service: HttpServiceService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule
      ],
      providers: [
        HttpServiceService
      ]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.inject(HttpServiceService);
  });

  it('should have response from getting all bookings', () => {
    const mockResponse = {
      time: new Date(),
      numberOfSlots: 2
    };
    service.getAvailableBookings().subscribe((res) => {
      expect(res).toBeDefined();
    })
    const req = httpTestingController.expectOne('http://localhost:3000/bookings');

    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should have response from placing a booking', () => {
    const mockResponse = {
      time: new Date(),
      numberOfSlots: 2
    };

    const mockData = {
      time: new Date()
    }

    service.placeBooking(mockData).subscribe((res) => {
      expect(res).toBeDefined();
    })
    const req = httpTestingController.expectOne('http://localhost:3000/place-booking');

    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });
});
