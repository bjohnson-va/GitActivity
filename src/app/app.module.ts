import { NgModule } from '@angular/core';
import { MatCardModule, MatListModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HelixLoaderModule } from '@bjohnson/ngx-helix-loader';
import { AsyncUiModule } from '@vendasta/uikit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApprovalsWithFeedbackModule } from './approvals-with-feedback/approvals-with-feedback.module';
import { GithubModule } from './github-api/github.module';
import { API_BASE_URL, API_TOKEN, GITHUB_ORG, PREV_PERIOD_START_DATE, STAT_START_DATE } from './github-api/inputs';
import { PullrequestsComponent } from './pullrequests/pullrequests.component';
import { StatModule } from './stat/stat.module';

const PERIOD_START = new Date(new Date().setDate(new Date().getDate() - 7));
const PREV_PERIOD_START = new Date(PERIOD_START).setDate(PERIOD_START.getDate() - 7);

@NgModule({
    declarations: [
        AppComponent,
        PullrequestsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatCardModule,
        GithubModule,
        ApprovalsWithFeedbackModule,
        StatModule,
        AsyncUiModule,
        MatTooltipModule,
        HelixLoaderModule,
    ],
    providers: [
        {
            provide: API_BASE_URL,
            useValue: 'https://api.github.com',
        },
        {
            provide: GITHUB_ORG,
            useValue: 'vendasta',
        },
        {
            provide: STAT_START_DATE,
            useValue: PERIOD_START,
        },
        {
            provide: PREV_PERIOD_START_DATE,
            useValue: PREV_PERIOD_START,
        },
        {
            provide: API_TOKEN,
            // TODO Get this from the user
            useValue: '<INSERT-HERE>',
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
