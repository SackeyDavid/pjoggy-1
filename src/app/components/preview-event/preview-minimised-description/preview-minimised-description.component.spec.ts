import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedDescriptionComponent } from './preview-minimised-description.component';

describe('PreviewMinimisedDescriptionComponent', () => {
  let component: PreviewMinimisedDescriptionComponent;
  let fixture: ComponentFixture<PreviewMinimisedDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
