import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// ---- Custom module
import { MaterialModule } from 'src/app/material.module';
import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from 'src/app/components/shared/shared.module';
// ---- Structural components
import { MainPageComponent } from './main-page.component';
import { MainContentHeaderComponent } from './main-content-header/main-content-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { MainNavComponent } from './main-nav/main-nav.component';
// ---- Pipe
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
// ---- Content component
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';
import { MainActiveEnvironmentsComponent } from './main-active-environments/main-active-environments.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { MainAnnouncementComponent } from './main-announcement/main-announcement.component';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { MainStatisticsComponent } from './main-statistics/main-statistics.component';
import { MainHelpNavComponent } from './main-help-nav/main-help-nav.component';
import { MainHelpFaqComponent } from './main-help-faq/main-help-faq.component';
import { MainHelpContactComponent } from './main-help-contact/main-help-contact.component';
// ---- Environment parts component
import { MainEnvironmentItemComponent } from './main-environment-item/main-environment-item.component';
import { MainEnvironmentWizardFormComponent } from './main-environment-wizard-form/main-environment-wizard-form.component';
import { MainEnvironmentItemFormComponent } from './main-environment-item-form/main-environment-item-form.component';
// ---- Workspace parts component
import { MainWorkspaceItemComponent } from './main-workspace-item/main-workspace-item.component';
import { MainWorkspaceItemDetailComponent } from './main-workspace-item-detail/main-workspace-item-detail.component';
import { MainWorkspaceFormComponent } from './main-workspace-form/main-workspace-form.component';
import { MainWorkspaceMembersComponent } from './main-workspace-members/main-workspace-members.component';
import { MainWorkspaceFoldersComponent } from './main-workspace-folders/main-workspace-folders.component';
import { MainJoinWorkspaceDialogComponent } from './main-join-workspace-dialog/main-join-workspace-dialog.component';
// ---- Shared component
import { MainSearchBoxComponent } from './main-search-box/main-search-box.component';
import { MainWorkspaceEnvironmentsComponent } from './main-workspace-environments/main-workspace-environments.component';
import { MainInstanceButtonComponent } from './main-instance-button/main-instance-button.component';
import { MainContentStateComponent } from './main-content-state/main-content-state.component';
import { MainUsersComponent } from './main-users/main-users.component';
import { MainWorkspaceQuotaFormComponent } from './main-workspace-quota-form/main-workspace-quota-form.component';
// import { MessageComponent } from 'src/app/components/shared/message/message.component';

@NgModule({
  declarations: [
    MainPageComponent,
    MainNavComponent,
    MainContentHeaderComponent,
    MainSearchBoxComponent,
    MainFooterComponent,
    MainCatalogComponent,
    MainMyWorkspacesComponent,
    MainWorkspaceOwnerComponent,
    MainAdminComponent,
    MainActiveEnvironmentsComponent,
    MainStatisticsComponent,
    MainHelpNavComponent,
    MainHelpFaqComponent,
    MainHelpContactComponent,
    MainAccountComponent,
    MainAnnouncementComponent,
    MainWorkspaceItemComponent,
    MainWorkspaceFormComponent,
    MainWorkspaceMembersComponent,
    MainWorkspaceFoldersComponent,
    MainEnvironmentItemComponent,
    MainEnvironmentWizardFormComponent,
    MainEnvironmentItemFormComponent,
    MainWorkspaceItemDetailComponent,
    MainWorkspaceEnvironmentsComponent,
    MainInstanceButtonComponent,
    MainContentStateComponent,
    MainJoinWorkspaceDialogComponent,
    MainUsersComponent,
    DateDisplayPipe,
    MainWorkspaceQuotaFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ClipboardModule,
    MainRoutingModule,
    MaterialModule,
    SharedModule,
    FontAwesomeModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class MainModule { }
