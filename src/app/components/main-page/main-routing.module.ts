import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainAnnouncementComponent } from './main-announcement/main-announcement.component';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';
import { MainAdminComponent } from './main-admin/main-admin.component';
import { MainStatisticsComponent } from './main-statistics/main-statistics.component';
import { MainActiveEnvironmentsComponent } from './main-active-environments/main-active-environments.component';
import { MainWorkspaceItemDetailComponent } from './main-workspace-item-detail/main-workspace-item-detail.component';
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
        children: [
          { path: ':workspaceId', component: MainWorkspaceItemDetailComponent }
        ]
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
        path: 'admin', component: MainAdminComponent,
        data: { breadcrumbs: ['home', 'admin'] }
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
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
