import { Injectable } from '@angular/core';
import { ObservableWorkStateMap, WorkStateMap } from '@vendasta/rx-utils';
import { Observable } from 'rxjs';
import { map, share, switchMap } from 'rxjs/operators';
import { PullRequest, PullRequestApi, PullRequestsListForOrgResponse, RepoName } from '../github-api/interfaces';
import { withConversionButWithMaps } from '../rx-utils';
import { doWorkIfInitial } from '../stolen/stolen';
import { StatsFetcher } from './stats-fetcher';

@Injectable()
export class StatsModel {
    readonly participationState = new ObservableWorkStateMap<RepoName, number>();
    readonly teamParticipationState = new ObservableWorkStateMap<RepoName, number>();
    readonly approvedWithCommentState = new ObservableWorkStateMap<RepoName, number>();
    readonly teamApprovedWithCommentState = new ObservableWorkStateMap<RepoName, number>();
    private readonly prsState = new ObservableWorkStateMap<string, PullRequestsListForOrgResponse>();
    readonly prs: WorkStateMap<string, PullRequest[]> = withConversionButWithMaps(
        this.prsState, (r: PullRequestsListForOrgResponse) => r.results,
    );

    constructor(
        private readonly stats: StatsFetcher,
        private readonly pullRequests: PullRequestApi,
        private readonly org: string,
        private readonly rangeStart: Date,
        private readonly rangeEnd: Date,
    ) {
    }

    fetchAll(org: string, repo: RepoName) {
        this.fetchPRs(repo);
        this.fetchParticipationStats(repo);
        this.fetchTeamParticipationStats(repo);
        this.fetchApprovalCommentStats(repo);
        this.fetchTeamApprovalCommentStats(repo);
    }

    fetchTeamApprovalCommentStats(repo: RepoName): void {
        const teamApprovedWithCommentFetch$ = this.prsState.getWorkResults$(repo).pipe(
            switchMap(pr => this.stats.acquireTeamCommentPercent$(pr.results)),
        );
        this.teamApprovedWithCommentState.startWork(repo, teamApprovedWithCommentFetch$);
    }

    fetchApprovalCommentStats(repo: RepoName): void {
        const approvedWithCommentFetch$ = this.fetchPRs(repo).pipe(
            switchMap(pr => this.stats.acquireCommentPercent$(pr)),
        );
        this.approvedWithCommentState.startWork(repo, approvedWithCommentFetch$);
    }

    fetchTeamParticipationStats(repo: RepoName): void {
        const teamParticipateFetch$ = this.fetchPRs(repo).pipe(
            switchMap(pr => this.stats.acquireTeamParticipationPercent$(pr)),
        );
        this.teamParticipationState.startWork(repo, teamParticipateFetch$);
    }

    fetchParticipationStats(repo: RepoName): void {
        const participateFetch$ = this.fetchPRs(repo).pipe(
            switchMap(pr => this.stats.acquireParticipationPercent$(pr)),
        );
        this.participationState.startWork(repo, participateFetch$);
    }

    private fetchPRs(repo: RepoName): Observable<PullRequest[]> {
        const prFetch$ = this.pullRequests.listForRepo({
            repoName: repo,
            org: this.org,
            rangeStart: this.rangeStart,
            rangeEnd: this.rangeEnd,
        }).pipe(share());
        return doWorkIfInitial(repo, this.prsState, () => prFetch$).pipe(map(r => r.results));
    }
}
