import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { GitHubClient } from './git-hub-client';
import { PullRequestsClient } from './pull-requests-client';
import { RepositoriesClient } from './repositories-client';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    RepositoriesClient,
    PullRequestsClient,
    GitHubClient,
  ]
})
export class GithubModule {
}
