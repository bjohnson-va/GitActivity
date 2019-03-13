import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StatModule } from '../stat/stat.module';
import { ApprovalsWithFeedbackComponent } from './approvals-with-feedback.component';

@NgModule({
    declarations: [
        ApprovalsWithFeedbackComponent,
    ],
    imports: [
        CommonModule,
        StatModule,
    ],
    exports: [
        ApprovalsWithFeedbackComponent,
    ],
})
export class ApprovalsWithFeedbackModule {
}
