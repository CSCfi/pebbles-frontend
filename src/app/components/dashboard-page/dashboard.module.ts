import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// ---- Custom module
import { MaterialModule } from 'src/app/material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
// ---- Components
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
import { DashboardCatalogComponent, JoinWorkspaceDialogComponent } from './dashboard-catalog/dashboard-catalog.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardEnvironmentItemComponent } from './dashboard-environment-item/dashboard-environment-item.component';
import { DashboardWorkspaceComponent } from './dashboard-workspace/dashboard-workspace.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { DashboardWorkspaceOwnerComponent } from './dashboard-workspace-owner/dashboard-workspace-owner.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardHelpComponent } from './dashboard-help/dashboard-help.component';
import { DashboardBreadcrumbComponent } from './dashboard-breadcrumb/dashboard-breadcrumb.component';
import { DashboardWorkspaceItemComponent } from './dashboard-workspace-item/dashboard-workspace-item.component';
import { MessageComponent } from 'src/app/components/common/message/message.component';
import { DashboardSearchBoxComponent } from './dashboard-search-box/dashboard-search-box.component';
import { DashboardWorkspaceDetailComponent } from './dashboard-workspace-detail/dashboard-workspace-detail.component';
// import { DashboardWorkspaceEnvironmentsComponent } from './dashboard-workspace-environments/dashboard-workspace-environments.component';
import { DashboardWorkspaceMembersComponent } from './dashboard-workspace-members/dashboard-workspace-members.component';
import { DashboardWorkspaceFoldersComponent } from './dashboard-workspace-folders/dashboard-workspace-folders.component';

import { DashboardEnvironmentFormComponent } from './dashboard-environment-form/dashboard-environment-form.component';
import { DashboardWorkspaceFormComponent } from './dashboard-workspace-form/dashboard-workspace-form.component';
import { DashboardEnvironmentItemFormComponent } from './dashboard-environment-item-form/dashboard-environment-item-form.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardCatalogComponent,
    DashboardWorkspaceComponent,
    DashboardAccountComponent,
    DashboardMessageComponent,
    DashboardWorkspaceOwnerComponent,
    DashboardWorkspaceDetailComponent,
    DashboardAdminComponent,
    DashboardStatisticsComponent,
    DashboardHelpComponent,
    JoinWorkspaceDialogComponent,
    DashboardEnvironmentItemComponent,
    DashboardWorkspaceItemComponent,
    DashboardHeaderComponent,
    DashboardFooterComponent,
    DashboardNavComponent,
    DashboardBreadcrumbComponent,
    DashboardSearchBoxComponent,
    MessageComponent,
    DashboardWorkspaceMembersComponent,
    DashboardWorkspaceFoldersComponent,
    DashboardEnvironmentFormComponent,
    DashboardWorkspaceFormComponent,
    DashboardEnvironmentItemFormComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
  ],
  exports: [
    DashboardPageComponent
  ],
})
export class DashboardModule  { }
