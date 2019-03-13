import { Injectable } from '@angular/core';
import { GitHubApiProvider } from './interfaces';
import { PullRequestsClient } from './pull-requests-client';
import { RepositoriesClient } from './repositories-client';

@Injectable()
export class GitHubClient implements GitHubApiProvider {

  constructor(
      public readonly repos: RepositoriesClient,
      public readonly pullRequests: PullRequestsClient,
  ) {
  }

}
