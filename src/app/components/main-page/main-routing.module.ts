import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainAnnouncementComponent } from './main-announcement/main-announcement.component';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';
import { MainUsersComponent } from './main-users/main-users.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';
import { MainStatisticsComponent } from './main-statistics/main-statistics.component';
import { MainActiveEnvironmentsComponent } from './main-active-environments/main-active-environments.component';
import { MainHelpFaqComponent } from './main-help-faq/main-help-faq.component';
import { MainHelpContactComponent } from './main-help-contact/main-help-contact.component';

export const routes: Routes = [
  {
    path: 'main', component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      {
        path: 'catalog', component: MainCatalogComponent,
        data: { breadcrumbs: [''] }
      },
      {
        path: 'my-workspaces', component: MainMyWorkspacesComponent,
        data: { breadcrumbs: ['home', 'my-workspaces'] }
      },
      {
        path: 'workspace-owner', component: MainWorkspaceOwnerComponent,
        data: { breadcrumbs: ['home', 'workspace-owner'] },
      },
      {
        path: 'account', component: MainAccountComponent,
        data: { breadcrumbs: ['home', 'account'] }
      },
      {
        path: 'announcements', component: MainAnnouncementComponent,
        data: { breadcrumbs: ['home', 'announcements'] }
      },
      {
        path: 'help',
        children: [
          { path: '', redirectTo: 'faq', pathMatch: 'full' },
          { path: 'faq', component: MainHelpFaqComponent },
          { path: 'contact', component: MainHelpContactComponent }
        ]
      },

      {
        path: 'active-environments', component: MainActiveEnvironmentsComponent,
        data: { breadcrumbs: ['home', 'active-environments'] }
      },
      {
        path: 'users', component: MainUsersComponent,
        data: { breadcrumbs: ['home', 'users'] }
      },
      {
        path: 'statistics', component: MainStatisticsComponent,
        data: { breadcrumbs: ['home', 'statistics'] }
      },
      {
        path: '**', component: NotFoundPageComponent,
        data: { breadcrumbs: [''] }
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
export class MainRoutingModule { }
