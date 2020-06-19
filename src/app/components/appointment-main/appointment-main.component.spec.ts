import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentMainComponent } from './appointment-main.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';

fdescribe('AppointmentMainComponent', () => {
  let component: AppointmentMainComponent;
  let fixture: ComponentFixture<AppointmentMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentMainComponent ],
      providers: [
        HttpClient,
        HttpHandler,
        FormBuilder
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have text "Book your inspection"', () => {
    const title = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(title.innerHTML).toBe('Book your inspection');
  });
});
