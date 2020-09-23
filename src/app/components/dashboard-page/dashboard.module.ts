import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
// import { AppModule } from 'src/app/app.module';

// ---- Custom routing module
import { DashboardRoutingModule } from './dashboard-routing.module';

// ---- Components
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { DashboardSummaryComponent, JoinWorkspaceDialogComponent } from './dashboard-summary/dashboard-summary.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardEnvironmentComponent } from './dashboard-environment/dashboard-environment.component';
import { DashboardEnvironmentItemComponent } from './dashboard-environment-item/dashboard-environment-item.component';
import { DashboardWorkspaceComponent } from './dashboard-workspace/dashboard-workspace.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { SearchEnvironmentItemComponent } from './search-environment-item/search-environment-item.component';
import { MessageComponent } from '../common/message/message.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardHeaderComponent,
    DashboardFooterComponent,
    DashboardNavComponent,
    DashboardAccountComponent,
    DashboardEnvironmentComponent,
    DashboardSummaryComponent,
    DashboardEnvironmentItemComponent,
    DashboardWorkspaceComponent,
    DashboardMessageComponent,
    JoinWorkspaceDialogComponent,
    SearchEnvironmentItemComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,

    // AppModule
  ],
  exports: [
    DashboardPageComponent
  ],
})
export class DashboardModule  { }
