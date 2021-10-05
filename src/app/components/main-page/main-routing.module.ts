import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { MainActiveSessionsComponent } from './main-active-sessions/main-active-sessions.component';
import { MainAnnouncementComponent } from './main-announcement/main-announcement.component';
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainHelpContactComponent } from './main-help-contact/main-help-contact.component';
import { MainHelpFaqComponent } from './main-help-faq/main-help-faq.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainPageComponent } from './main-page.component';
import { MainStatisticsComponent } from './main-statistics/main-statistics.component';
import { MainSystemStatusComponent } from './main-status/main-system-status/main-system-status.component';
import { MainUsersComponent } from './main-users/main-users.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';

export const routes: Routes = [
  {
    path: 'main', component: MainPageComponent,
    children: [
      {path: '', redirectTo: 'catalog', pathMatch: 'full'},
      {
        path: 'catalog', component: MainCatalogComponent,
        data: {breadcrumbs: ['']}
      },
      {
        path: 'my-workspaces', component: MainMyWorkspacesComponent,
        data: {breadcrumbs: ['home', 'my-workspaces']}
      },
      {
        path: 'workspace-owner', component: MainWorkspaceOwnerComponent,
        data: {breadcrumbs: ['home', 'workspace-owner']},
      },
      {
        path: 'account', component: MainAccountComponent,
        data: {breadcrumbs: ['home', 'account']}
      },
      {
        path: 'announcements', component: MainAnnouncementComponent,
        data: {breadcrumbs: ['home', 'announcements']}
      },
      {
        path: 'help',
        children: [
          {path: '', redirectTo: 'faq', pathMatch: 'full'},
          {path: 'faq', component: MainHelpFaqComponent},
          {path: 'contact', component: MainHelpContactComponent}
        ]
      },

      {
        path: 'active-sessions', component: MainActiveSessionsComponent,
        data: {breadcrumbs: ['home', 'active-sessions']}
      },
      {
        path: 'users', component: MainUsersComponent,
        data: {breadcrumbs: ['home', 'users']}
      },
      {
        path: 'system-status', component: MainSystemStatusComponent,
        data: {breadcrumbs: ['home', 'system-status']}
      },
      {
        path: 'statistics', component: MainStatisticsComponent,
        data: {breadcrumbs: ['home', 'statistics']}
      },
      {
        path: '**', component: NotFoundPageComponent,
        data: {breadcrumbs: ['']}
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
