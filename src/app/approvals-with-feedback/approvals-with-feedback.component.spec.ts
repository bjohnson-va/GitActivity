import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsWithFeedbackComponent } from './approvals-with-feedback.component';

describe('ApprovalsWithFeedbackComponent', () => {
  let component: ApprovalsWithFeedbackComponent;
  let fixture: ComponentFixture<ApprovalsWithFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalsWithFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalsWithFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
