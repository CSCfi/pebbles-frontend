import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardAccountComponent } from './dashboard-account/dashboard-account.component';
import { DashboardEnvironmentComponent } from './dashboard-environment/dashboard-environment.component';
import { DashboardCatalogComponent } from './dashboard-catalog/dashboard-catalog.component';
import { DashboardWorkspaceComponent } from './dashboard-workspace/dashboard-workspace.component';
import { DashboardMessageComponent } from './dashboard-message/dashboard-message.component';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardPageComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', component: DashboardCatalogComponent },
      { path: 'workspace', component: DashboardWorkspaceComponent },
      { path: 'workspace-manager', component: DashboardWorkspaceComponent },
      { path: 'account', component: DashboardAccountComponent },
      { path: 'environment', component: DashboardEnvironmentComponent },
      { path: 'message', component: DashboardMessageComponent },
      { path: '**', component: NotFoundPageComponent },
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
