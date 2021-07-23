import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventManagerHomeComponentComponent } from './event-manager-home-component.component';

describe('EventManagerHomeComponentComponent', () => {
  let component: EventManagerHomeComponentComponent;
  let fixture: ComponentFixture<EventManagerHomeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventManagerHomeComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventManagerHomeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
