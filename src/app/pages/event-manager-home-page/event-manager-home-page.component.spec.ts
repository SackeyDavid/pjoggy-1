import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagerHomePageComponent } from './event-manager-home-page.component';

describe('EventManagerHomePageComponent', () => {
  let component: EventManagerHomePageComponent;
  let fixture: ComponentFixture<EventManagerHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventManagerHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManagerHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
