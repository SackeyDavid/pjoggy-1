import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEventAlertComponent } from './delete-event-alert.component';

describe('DeleteEventAlertComponent', () => {
  let component: DeleteEventAlertComponent;
  let fixture: ComponentFixture<DeleteEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEventAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
