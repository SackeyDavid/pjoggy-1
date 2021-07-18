import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventAlertComponent } from './edit-event-alert.component';

describe('EditEventAlertComponent', () => {
  let component: EditEventAlertComponent;
  let fixture: ComponentFixture<EditEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditEventAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
