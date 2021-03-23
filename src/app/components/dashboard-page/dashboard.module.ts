import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// ---- Custom module
import { MaterialModule } from 'src/app/material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
// ---- structural components
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardContentHeaderComponent } from './dashboard-content-header/dashboard-content-header.component';
import { DashboardFooterComponent } from './dashboard-footer/dashboard-footer.component';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';
// ---- content component
import { DashboardCatalogComponent } from './dashboard-catalog/dashboard-catalog.component';
import { DashboardMyWorkspacesComponent } from './dashboard-my-workspaces/dashboard-my-workspaces.component';
import { DashboardWorkspaceOwnerComponent } from './dashboard-workspace-owner/dashboard-workspace-owner.component';
import { DashboardActiveEnvironmentsComponent } from './dashboard-active-environments/dashboard-active-environments.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardAnnouncementComponent } from './dashboard-announcement/dashboard-announcement.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardHelpComponent } from './dashboard-help/dashboard-help.component';
// ---- environment parts component
import { DashboardEnvironmentItemComponent } from './dashboard-environment-item/dashboard-environment-item.component';
import { DashboardEnvironmentFormComponent } from './dashboard-environment-form/dashboard-environment-form.component';
import { DashboardEnvironmentItemFormComponent } from './dashboard-environment-item-form/dashboard-environment-item-form.component';
// ---- workspace parts component
import { DashboardWorkspaceItemComponent } from './dashboard-workspace-item/dashboard-workspace-item.component';
import { DashboardWorkspaceItemDetailComponent } from './dashboard-workspace-item-detail/dashboard-workspace-item-detail.component';
import { DashboardWorkspaceFormComponent } from './dashboard-workspace-form/dashboard-workspace-form.component';
import { DashboardWorkspaceMembersComponent } from './dashboard-workspace-members/dashboard-workspace-members.component';
import { DashboardWorkspaceFoldersComponent } from './dashboard-workspace-folders/dashboard-workspace-folders.component';
// ---- shared component
import { DashboardSearchBoxComponent } from './dashboard-search-box/dashboard-search-box.component';
import { DashboardWorkspaceEnvironmentsComponent } from './dashboard-workspace-environments/dashboard-workspace-environments.component';
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
    DashboardActiveEnvironmentsComponent,
    DashboardStatisticsComponent,
    DashboardHelpComponent,
    DashboardAccountComponent,
    DashboardAnnouncementComponent,
    DashboardWorkspaceItemComponent,
    DashboardWorkspaceFormComponent,
    DashboardWorkspaceMembersComponent,
    DashboardWorkspaceFoldersComponent,
    DashboardEnvironmentItemComponent,
    DashboardEnvironmentFormComponent,
    DashboardEnvironmentItemFormComponent,
    DashboardWorkspaceItemDetailComponent,
    DashboardWorkspaceEnvironmentsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    DashboardPageComponent
  ],
})
export class DashboardModule { }
