import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverEventAlertComponent } from './recover-event-alert.component';

describe('RecoverEventAlertComponent', () => {
  let component: RecoverEventAlertComponent;
  let fixture: ComponentFixture<RecoverEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverEventAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
