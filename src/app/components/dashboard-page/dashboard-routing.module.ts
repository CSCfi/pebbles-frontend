import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardCatalogComponent } from './dashboard-catalog/dashboard-catalog.component';
import { DashboardWorkspaceComponent } from './dashboard-workspace/dashboard-workspace.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';
import { DashboardWorkspaceOwnerComponent } from './dashboard-workspace-owner/dashboard-workspace-owner.component';
import { DashboardHelpComponent } from './dashboard-help/dashboard-help.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DashboardStatisticsComponent } from './dashboard-statistics/dashboard-statistics.component';
import { DashboardWorkspaceWizardComponent } from './dashboard-workspace-wizard/dashboard-workspace-wizard.component';
import { DashboardWorkspaceDetailComponent } from './dashboard-workspace-detail/dashboard-workspace-detail.component';

export const routes: Routes = [
  {
    path: 'dashboard', component: DashboardPageComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      {
        path: 'catalog', component: DashboardCatalogComponent,
        data: { breadcrumbs: [''] }
      },
      {
        path: 'user-workspace', component: DashboardWorkspaceComponent,
        data: { breadcrumbs: ['home', 'workspace'] }
      },
      {
        path: 'workspace-owner', component: DashboardWorkspaceOwnerComponent,
        data: { breadcrumbs: ['home', 'workspace-owner'] }
      },
      {
        path: 'workspace-owner/wizard', component: DashboardWorkspaceWizardComponent,
        data: { breadcrumbs: ['home', 'workspace-owner', 'wizard'] }
      },
      {
        path: 'workspace-owner/detail/:id', component: DashboardWorkspaceDetailComponent,
        data: { breadcrumbs: ['home', 'workspace-owner', 'detail', ':id'] }
      },
      {
        path: 'account', component: DashboardAccountComponent,
        data: { breadcrumbs: ['home', 'account'] }
      },
      {
        path: 'message', component: DashboardMessageComponent,
        data: { breadcrumbs: ['home', 'message'] }
      },
      {
        path: 'help', component: DashboardHelpComponent,
        data: { breadcrumbs: ['home', 'help'] }
      },

      {
        path: 'admin', component: DashboardAdminComponent,
        data: { breadcrumbs: ['home', 'admin'] }
      },
      {
        path: 'statistics', component: DashboardStatisticsComponent,
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
export class DashboardRoutingModule { }
