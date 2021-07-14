import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewMinimisedOrganizersComponent } from './preview-minimised-organizers.component';

describe('PreviewMinimisedOrganizersComponent', () => {
  let component: PreviewMinimisedOrganizersComponent;
  let fixture: ComponentFixture<PreviewMinimisedOrganizersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewMinimisedOrganizersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewMinimisedOrganizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
