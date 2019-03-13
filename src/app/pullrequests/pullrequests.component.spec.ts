import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PullrequestsComponent } from './pullrequests.component';

describe('PullrequestsComponent', () => {
  let component: PullrequestsComponent;
  let fixture: ComponentFixture<PullrequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PullrequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PullrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
