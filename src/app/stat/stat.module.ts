import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material';
import { StatComponent } from './stat.component';
import { StatsFetcher } from './stats-fetcher';

@NgModule({
    declarations: [StatComponent],
    exports: [
        StatComponent,
    ],
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
    ],
    providers: [
        StatsFetcher,
    ],
})
export class StatModule {
}
