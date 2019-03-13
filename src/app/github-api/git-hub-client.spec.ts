import { TestBed } from '@angular/core/testing';

import { GitHubClient } from './git-hub-client';

describe('GitHubClient', () => {
  beforeEach(() => {});

  describe('should be created', () => {
    const service: GitHubClient = TestBed.get(GitHubClient);
    expect(service).toBeTruthy();
  });
});
