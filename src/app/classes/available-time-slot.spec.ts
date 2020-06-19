import { AvailableTimeSlot } from './available-time-slot';

describe('AvailableTimeSlot', () => {
  it('should create an instance', () => {
    let time = new Date();
    let numberOfSlots = 2;
    expect(new AvailableTimeSlot(time, numberOfSlots)).toBeTruthy();
  });
});
