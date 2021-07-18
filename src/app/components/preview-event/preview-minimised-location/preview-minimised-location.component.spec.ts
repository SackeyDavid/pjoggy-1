import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedLocationComponent } from './preview-minimised-location.component';

describe('PreviewMinimisedLocationComponent', () => {
  let component: PreviewMinimisedLocationComponent;
  let fixture: ComponentFixture<PreviewMinimisedLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
