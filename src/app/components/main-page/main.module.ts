import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/components/shared/shared.module';
// ---- Custom module
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon.module';
// ---- Pipe
import { DateDisplayPipe } from '../../pipes/date-display.pipe';
import { LifeTimeDisplayPipe } from '../../pipes/life-time-display.pipe';
import { RemainingDaysDisplayPipe } from '../../pipes/remaining-days-display.pipe';
// ---- Content component
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';
import { MainActiveSessionsComponent } from './main-active-sessions/main-active-sessions.component';
import { MainMessageComponent } from './main-message/main-message.component';
import { MainHelpComponent } from './main-help/main-help.component';
import { MainAccountComponent } from './main-account/main-account.component';
// ---- Application parts component
import { MainApplicationItemComponent } from './main-application-item/main-application-item.component';
import {
  MainApplicationWizardFormComponent
} from './main-application-wizard-form/main-application-wizard-form.component';
import { MainSessionButtonComponent } from './main-session-button/main-session-button.component';
// ---- Structural components
import { MainPageComponent } from './main-page.component';
import { MainRoutingModule } from './main-routing.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MainContentHeaderComponent } from './main-content-header/main-content-header.component';
import { MainSearchBoxComponent } from './main-search-box/main-search-box.component';
import { MainContentStateComponent } from './main-content-state/main-content-state.component';
// ---- Workspace parts component
import { MainWorkspaceItemDetailComponent } from './main-workspace-item-detail/main-workspace-item-detail.component';
import { MainJoinWorkspaceDialogComponent } from './main-join-workspace-dialog/main-join-workspace-dialog.component';
import { MainWorkspaceFormComponent } from './main-workspace-form/main-workspace-form.component';
import {
  MainWorkspaceApplicationsComponent
} from './main-workspace-applications/main-workspace-applications.component';
import { MainWorkspaceItemComponent } from './main-workspace-item/main-workspace-item.component';
import { MainWorkspaceMembersComponent } from './main-workspace-members/main-workspace-members.component';
import {
  MainSelectWorkspaceDialogComponent
} from './main-select-workspace-dialog/main-select-workspace-dialog.component';
import {
  MainWorkspaceCustomImagesComponent
} from "./main-workspace-custom-images/main-workspace-custom-images.component";
import { MainCustomImageFormComponent } from "./main-custom-image-form/main-custom-image-form.component";
import {
  MainApplicationAdvancedFormComponent
} from "./main-application-advanced-form/main-application-advanced-form.component";
import { MainTourBubbleComponent } from "./main-tour-bubble/main-tour-bubble.component";

@NgModule({
  declarations: [
    MainPageComponent,
    MainNavComponent,
    MainContentHeaderComponent,
    MainSearchBoxComponent,
    MainCatalogComponent,
    MainMyWorkspacesComponent,
    MainWorkspaceOwnerComponent,
    MainActiveSessionsComponent,
    MainHelpComponent,
    MainAccountComponent,
    MainMessageComponent,
    MainWorkspaceFormComponent,
    MainWorkspaceItemComponent,
    MainWorkspaceItemDetailComponent,
    MainWorkspaceMembersComponent,
    MainWorkspaceApplicationsComponent,
    MainWorkspaceCustomImagesComponent,
    MainApplicationItemComponent,
    MainApplicationWizardFormComponent,
    MainApplicationAdvancedFormComponent,
    MainSessionButtonComponent,
    MainContentStateComponent,
    MainJoinWorkspaceDialogComponent,
    DateDisplayPipe,
    LifeTimeDisplayPipe,
    RemainingDaysDisplayPipe,
    MainSelectWorkspaceDialogComponent,
    MainCustomImageFormComponent,
    MainTourBubbleComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    MainRoutingModule,
    MaterialModule,
    SharedModule,
    FontAwesomeModule,
    IconModule,
  ],
  providers: [DateDisplayPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    MainApplicationItemComponent,
    LifeTimeDisplayPipe,
    IconModule,
  ]
})
export class MainModule {
}
