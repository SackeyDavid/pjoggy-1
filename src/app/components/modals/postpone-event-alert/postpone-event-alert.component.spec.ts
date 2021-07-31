import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostponeEventAlertComponent } from './postpone-event-alert.component';

describe('PostponeEventAlertComponent', () => {
  let component: PostponeEventAlertComponent;
  let fixture: ComponentFixture<PostponeEventAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostponeEventAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostponeEventAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
