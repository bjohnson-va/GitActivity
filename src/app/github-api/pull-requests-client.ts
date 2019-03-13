import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_URL, API_TOKEN } from './inputs';
import {
    PullRequestApi,
    PullRequestListCommentsParams,
    PullRequestListCommentsResponse,
    PullRequestListReviewsResponse,
    PullRequestsListForOrgResponse,
    PullRequestsListForRepoParams
} from './interfaces';

export function parseResponse(responseBody: any[],
                              org: string, repoName: string): PullRequestsListForOrgResponse {
    return {
        results: responseBody.map(r => ({
            title: r['title'],
            number: r['number'],
            org: org,
            repoName: repoName,
            user: {
                login: r['user']['login'],
            },
        })),
    };
}

function parseCommentsResponse(responseBody: any[]): PullRequestListCommentsResponse {
    return {
        results: responseBody.map(v => ({
            user: {
                login: v['user']['login'],
            },
        }))
    };
}

function parseReviewsResponse(responseBody: any[]): PullRequestListReviewsResponse {
    return {
        results: responseBody.map(v => ({
            user: {
                login: v['user']['login'],
            },
            state: v['state'],
        }))
    };
}

export class PullRequestsClient implements PullRequestApi {

    constructor(
        private readonly httpClient: HttpClient,
        @Inject(API_BASE_URL) private readonly baseUrl: string,
        @Inject(API_TOKEN) private readonly token: string,
    ) {
    }

    listForRepo(params: PullRequestsListForRepoParams): Observable<PullRequestsListForOrgResponse> {
        const targetUrl = `${this.baseUrl}/search/issues`; // ${params.org}/${params.repoName}/pulls`;
        const dateMinParam = params.rangeStart.toISOString().slice(0, 10);
        const dateMaxParam = params.rangeEnd.toISOString().slice(0, 10);
        return this.httpClient.get(targetUrl, {
            headers: new HttpHeaders({
                'Accept': 'application/vnd.github.v3+json,application/vnd.github.symmetra-preview+json',
                'Authorization': `token ${this.token}`,
            }),
            params: {
                'state': 'all',
                'per_page': '50',
                'q': `is:pr+repo:${params.org}/${params.repoName}+` +
                    `created:>${dateMinParam}+created:<=${dateMaxParam}`,
            },
        }).pipe(map((r: any) => parseResponse(r['items'] as any[], params.org, params.repoName)));
    }

    listCommentsForPR(params: PullRequestListCommentsParams): Observable<PullRequestListCommentsResponse> {
        const targetUrl = `${this.baseUrl}/repos/${params.org}/${params.repoName}/` +
            `issues/${params.pullRequestId}/comments`;
        return this.httpClient.get(targetUrl, {
            headers: new HttpHeaders({
                'Accept': 'application/vnd.github.v3+json,application/vnd.github.symmetra-preview+json',
                'Authorization': `token ${this.token}`,
            }),
            params: {
                'per_page': '100',
            },
        }).pipe(map(r => parseCommentsResponse(<any[]>r)));
    }

    listReviewsForPR(params: { org: string; repoName: string; pullRequestId: number }): Observable<PullRequestListReviewsResponse> {
        const targetUrl = `${this.baseUrl}/repos/${params.org}/${params.repoName}/` +
            `pulls/${params.pullRequestId}/reviews`;
        return this.httpClient.get(targetUrl, {
            headers: new HttpHeaders({
                'Accept': 'application/vnd.github.v3+json,application/vnd.github.symmetra-preview+json',
                'Authorization': `token ${this.token}`,
            }),
            params: {
                'per_page': '100',
            },
        }).pipe(map(r => parseReviewsResponse(<any[]>r)));
    }
}
