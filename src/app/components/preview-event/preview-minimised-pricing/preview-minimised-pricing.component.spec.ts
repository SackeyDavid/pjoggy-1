import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedPricingComponent } from './preview-minimised-pricing.component';

describe('PreviewMinimisedPricingComponent', () => {
  let component: PreviewMinimisedPricingComponent;
  let fixture: ComponentFixture<PreviewMinimisedPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedPricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
