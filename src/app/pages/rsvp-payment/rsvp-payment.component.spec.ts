import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpPaymentComponent } from './rsvp-payment.component';

describe('RsvpPaymentComponent', () => {
  let component: RsvpPaymentComponent;
  let fixture: ComponentFixture<RsvpPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvpPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
