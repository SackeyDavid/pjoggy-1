import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RsvpUserComponent } from './rsvp-user.component';

describe('RsvpUserComponent', () => {
  let component: RsvpUserComponent;
  let fixture: ComponentFixture<RsvpUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RsvpUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RsvpUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
