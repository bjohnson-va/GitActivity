import { Component, Input, OnInit } from '@angular/core';
import { PullRequest } from '../github-api/interfaces';

@Component({
  selector: 'app-approvals-with-feedback',
  templateUrl: './approvals-with-feedback.component.html',
  styleUrls: ['./approvals-with-feedback.component.scss']
})
export class ApprovalsWithFeedbackComponent implements OnInit {

  @Input() prs: PullRequest[];
  feedbackPercent = 50;

  constructor() { }

  ngOnInit() {
  }

}
