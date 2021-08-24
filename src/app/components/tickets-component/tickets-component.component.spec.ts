import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsComponentComponent } from './tickets-component.component';

describe('TicketsComponentComponent', () => {
  let component: TicketsComponentComponent;
  let fixture: ComponentFixture<TicketsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
