import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEventAlertComponent } from './cancel-event-alert.component';

describe('CancelEventAlertComponent', () => {
  let component: CancelEventAlertComponent;
  let fixture: ComponentFixture<CancelEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelEventAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
