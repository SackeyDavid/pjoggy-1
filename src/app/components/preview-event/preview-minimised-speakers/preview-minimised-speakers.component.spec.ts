import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedSpeakersComponent } from './preview-minimised-speakers.component';

describe('PreviewMinimisedSpeakersComponent', () => {
  let component: PreviewMinimisedSpeakersComponent;
  let fixture: ComponentFixture<PreviewMinimisedSpeakersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedSpeakersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedSpeakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
