import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedSponsorsComponent } from './preview-minimised-sponsors.component';

describe('PreviewMinimisedSponsorsComponent', () => {
  let component: PreviewMinimisedSponsorsComponent;
  let fixture: ComponentFixture<PreviewMinimisedSponsorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedSponsorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedSponsorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
