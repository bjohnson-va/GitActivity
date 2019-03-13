import { Component, Inject } from '@angular/core';
import { ObservableWorkState, WorkStateMap, WorkStates } from '@vendasta/rx-utils';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GitHubClient } from './github-api/git-hub-client';
import { GITHUB_ORG, PREV_PERIOD_START_DATE, STAT_START_DATE } from './github-api/inputs';
import { PullRequest, RepoName, Repository, ReposListForOrgResponse } from './github-api/interfaces';
import { withConversion, withSideEffect } from './rx-utils';
import { StatsFetcher } from './stat/stats-fetcher';
import { StatsModel } from './stat/stats-model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'GitActivity';
    userDisplayName = 'Brad Johnson'; // TODO: Make selectable
    readonly repos: WorkStates<Repository[]>;
    readonly prs: WorkStateMap<string, PullRequest[]>;
    private readonly reposState = new ObservableWorkState<ReposListForOrgResponse>();
    private readonly stats = new StatsModel(this.fetcher, this.github.pullRequests,
        this.org, this.startDate, new Date(),
    );
    private readonly prevStats = new StatsModel(this.fetcher, this.github.pullRequests,
        this.org, this.prevStatDate, this.startDate,
    );
    private readonly participation: WorkStateMap<RepoName, number>;
    private readonly prevParticipation: WorkStateMap<RepoName, number>;
    private readonly approvedWithComment: WorkStateMap<RepoName, number>;
    private readonly teamParticipation: WorkStateMap<RepoName, number>;
    private readonly teamApprovedWithComments: WorkStateMap<RepoName, number>;

    constructor(
        private readonly github: GitHubClient,
        private readonly fetcher: StatsFetcher,
        @Inject(GITHUB_ORG) private readonly org: string,
        @Inject(STAT_START_DATE) readonly startDate: Date,
        @Inject(PREV_PERIOD_START_DATE) private readonly prevStatDate: Date,
    ) {
        const repoWork = of({results: [{name: 'sales-center-client'}]})
        // const repoWork = this.github.repos.listForOrg({
        //     org: org,
        // }) TODO: More than one repo
            .pipe(
                tap(repos => this.fetchPullRequests(org, repos.results))
            );
        this.reposState.startWork(repoWork);
        this.repos = withConversion(
            this.reposState, (r: ReposListForOrgResponse) => r.results,
        );
        this.prs = this.stats.prs;

        this.participation = this.stats.participationState;
        // this.participation = withSideEffect(
        //     this.stats.participationState,
        //     (id: RepoName) => this.prevStats.fetchParticipationStats(id),
        // );
        // this.prevParticipation = this.prevStats.participationState;
        this.approvedWithComment = this.stats.approvedWithCommentState;
        this.teamParticipation = this.stats.teamParticipationState;
        this.teamApprovedWithComments = this.stats.teamApprovedWithCommentState;
    }

    private fetchPullRequests(org: string, repos: Repository[]): void {
        repos.map(repo => {
            this.stats.fetchAll(org, repo.name);
        });
    }
}
