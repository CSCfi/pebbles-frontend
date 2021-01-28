import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// ---- Custom module
import { MaterialModule } from 'src/app/material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
// ---- Components
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardContentHeaderComponent } from './dashboard-content-header/dashboard-content-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';

import { DashboardCatalogComponent, JoinWorkspaceDialogComponent } from './dashboard-catalog/dashboard-catalog.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardAnnouncementComponent } from './dashboard-announcement/dashboard-announcement.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardHelpComponent } from './dashboard-help/dashboard-help.component';

import { DashboardEnvironmentItemComponent } from './dashboard-environment-item/dashboard-environment-item.component';
import { DashboardEnvironmentFormComponent } from './dashboard-environment-form/dashboard-environment-form.component';
import { DashboardEnvironmentItemFormComponent } from './dashboard-environment-item-form/dashboard-environment-item-form.component';

import { DashboardMyWorkspacesComponent } from './dashboard-my-workspaces/dashboard-my-workspaces.component';
import { DashboardWorkspaceOwnerComponent } from './dashboard-workspace-owner/dashboard-workspace-owner.component';
import { DashboardWorkspaceItemComponent } from './dashboard-workspace-item/dashboard-workspace-item.component';
import { DashboardWorkspaceFormComponent } from './dashboard-workspace-form/dashboard-workspace-form.component';
import { DashboardWorkspaceDetailComponent } from './dashboard-workspace-detail/dashboard-workspace-detail.component';
import { DashboardWorkspaceMembersComponent } from './dashboard-workspace-members/dashboard-workspace-members.component';
import { DashboardWorkspaceFoldersComponent } from './dashboard-workspace-folders/dashboard-workspace-folders.component';
import { DashboardSearchBoxComponent } from './dashboard-search-box/dashboard-search-box.component';
// import { MessageComponent } from 'src/app/components/shared/message/message.component';

@NgModule({
  declarations: [
    DashboardPageComponent,
    DashboardNavComponent,
    DashboardContentHeaderComponent,
    DashboardSearchBoxComponent,
    DashboardFooterComponent,
    DashboardCatalogComponent,
    DashboardMyWorkspacesComponent,
    DashboardWorkspaceOwnerComponent,
    DashboardAdminComponent,
    DashboardStatisticsComponent,
    DashboardHelpComponent,
    DashboardAccountComponent,
    DashboardAnnouncementComponent,
    DashboardWorkspaceDetailComponent,
    DashboardWorkspaceItemComponent,
    DashboardWorkspaceFormComponent,
    DashboardWorkspaceMembersComponent,
    DashboardWorkspaceFoldersComponent,
    JoinWorkspaceDialogComponent,
    DashboardEnvironmentItemComponent,
    DashboardEnvironmentFormComponent,
    DashboardEnvironmentItemFormComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
  ],
  exports: [
    DashboardPageComponent
  ],
})
export class DashboardModule { }
