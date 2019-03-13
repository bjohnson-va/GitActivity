import { Observable } from 'rxjs';

export interface ReposListForOrgParams {
    org: string;
}

export type RepoName = string;

export interface Repository {
    name: RepoName;
}

export interface ReposListForOrgResponse {
    results: Repository[];
}

export interface PullRequestsListForRepoParams {
    org: string;
    repoName: string;
    rangeStart: Date;
    rangeEnd: Date;
}

export interface PullRequest {
    user: {
        login: string;
    };
    repoName: string;
    org: string;
    number: number;
    title: string;
}

export interface PullRequestsListForOrgResponse {
    results: PullRequest[];
}

export interface RepositoryApi {
    listForOrg: (o: ReposListForOrgParams) => Observable<ReposListForOrgResponse>;
}

export interface PullRequestApi {
    listForRepo: (p: PullRequestsListForRepoParams) => Observable<PullRequestsListForOrgResponse>;

    listCommentsForPR(params: PullRequestListCommentsParams): Observable<PullRequestListCommentsResponse>;
}

export interface GitHubApiProvider {
    repos: RepositoryApi;
    pullRequests: PullRequestApi;
}

export interface PullRequestListCommentsParams {
    pullRequestId: number;
    repoName: string;
    org: string;
}

export interface Comment {
    user: {
        login: string;
    };
}

export interface PullRequestListCommentsResponse {
    results: Comment[];
}


export interface Review {
    state: string;
    user: {
        login: string;
    };
}

export interface PullRequestListReviewsResponse {
    results: Review[];
}
