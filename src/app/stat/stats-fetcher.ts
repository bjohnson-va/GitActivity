import { Injectable } from '@angular/core';
import { ObservableWorkStateMap } from '@vendasta/rx-utils';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GitHubClient } from '../github-api/git-hub-client';
import { PullRequest, PullRequestListCommentsResponse, PullRequestListReviewsResponse } from '../github-api/interfaces';
import { doWorkIfInitial } from '../stolen/stolen';

const USER_NAME = 'bjohnson-va';
const TEAM = ['syuan-va', 'jdahl-va', 'bhingston-va', 'jfraser-va', 'ltetreault'];

@Injectable()
export class StatsFetcher {
    private reviews = new ObservableWorkStateMap<string, PullRequestListReviewsResponse>();
    private comments = new ObservableWorkStateMap<string, PullRequestListCommentsResponse>();

    private static userHasCommented(response: PullRequestListCommentsResponse, userName: string): boolean {
        return response.results.map(v => v.user.login).includes(userName);
    }

    private static userHasReviewed(response: PullRequestListReviewsResponse, userName: string): boolean {
        return response.results.map(v => v.user.login).includes(userName);
    }

    private static userHasApproved(response: PullRequestListReviewsResponse, userName: string): boolean {
        const userReviews = response.results
            .filter(v => v.user.login === userName)
            .map(v => v.state);
        if (userReviews.length === 0) {
            return false;
        }
        return userReviews.slice(-1)[0] === 'APPROVED';
    }

    constructor(private readonly github: GitHubClient) {
    }

    acquireParticipationPercent$(prs: PullRequest[]): Observable<number> {
        return this.acquireParticipationPercentForUser$(prs, USER_NAME);
    }

    acquireTeamParticipationPercent$(prs: PullRequest[]): Observable<number> {
        const percents$ = TEAM.map(name => this.acquireParticipationPercentForUser$(prs, name));
        return combineLatest(percents$).pipe(
            map((allPercents: number[]) => {
                const sum = allPercents.reduce(function(a, b) { return a + b; });
                return sum / allPercents.length;
            }),
        );
    }

    private acquireParticipationPercentForUser$(prs: PullRequest[], user: string): Observable<number> {
        if (prs.length === 0) {
            return of(0);
        }
        // TODO: Figure out a better way to omit user's own PRs
        prs = prs.filter(pr => pr.user.login !== user);
        const check = prs.map(pr => this.checkBoth(pr, user));
        const commentChecks$ = combineLatest(check);
        return commentChecks$.pipe(
            map((results: boolean[]) => results.filter(Boolean).length),
            map(count => Math.floor((count * 100) / prs.length)),
        );
    }

    acquireCommentPercent$(prs: PullRequest[]): Observable<number> {
        return this.acquireCommentPercentForUser$(prs, USER_NAME);
    }

    acquireTeamCommentPercent$(prs: PullRequest[]): Observable<number> {
        const percents$ = TEAM.map(name => this.acquireCommentPercentForUser$(prs, name));
        return combineLatest(percents$).pipe(
            map((allPercents: number[]) => {
                const sum = allPercents.reduce(function(a, b) { return a + b; });
                return sum / allPercents.length;
            }),
        );
    }

    acquireCommentPercentForUser$(prs: PullRequest[], userName: string): Observable<number> {
        if (prs.length === 0) {
            return of(0);
        }
        // TODO: Figure out a better way to omit user's own PRs
        prs = prs.filter(pr => pr.user.login !== userName);
        const approvals$ = combineLatest(prs.map(pr => this.isApproved(pr, userName))).pipe(
            map(approved => approved.filter(Boolean).length),
        );
        const commented$ = combineLatest(prs.map(pr => this.checkHasComment(pr, userName))).pipe(
            map(commented => commented.filter(Boolean).length),
        );
        return combineLatest([approvals$, commented$]).pipe(
            map(([approvals, commented]) => approvals > 0 ? commented / approvals : 0),
            map(fraction => Math.floor(fraction * 100)),
        );
    }

    private isApproved(pr: PullRequest, userName: string): Observable<boolean> {
        const optimized = this.cautiousListReviews(pr);
        return optimized.pipe(map(r => StatsFetcher.userHasApproved(r, userName)));
    }

    private checkHasComment(pr: PullRequest, userName: string): Observable<boolean> {
        return this.cautiousListComments(pr).pipe(map(r => StatsFetcher.userHasCommented(r, userName)));
    }

    private checkHasReview(pr: PullRequest, userName: string): Observable<boolean> {
        return this.cautiousListReviews(pr).pipe(
            map(r => StatsFetcher.userHasReviewed(r, userName)),
        );
    }

    private checkBoth(pr: PullRequest, userName: string): Observable<boolean> {
        return combineLatest([
            this.checkHasComment(pr, userName),
            this.checkHasReview(pr, userName),
        ]).pipe(
            map(([comment, review]) => comment || review),
        );
    }

    private cautiousListComments(pr: PullRequest): Observable<PullRequestListCommentsResponse> {
        const work = this.github.pullRequests.listCommentsForPR({
            org: pr.org,
            repoName: pr.repoName,
            pullRequestId: pr.number,
        });
        return doWorkIfInitial(pr.org + pr.repoName + pr.number,
            this.comments,
            () => work,
        );
    }

    private cautiousListReviews(pr: PullRequest): Observable<PullRequestListReviewsResponse> {
        const work = this.github.pullRequests.listReviewsForPR({
            org: pr.org,
            repoName: pr.repoName,
            pullRequestId: pr.number,
        });
        return doWorkIfInitial(pr.org + pr.repoName + pr.number, this.reviews, () => work);
    }
}
