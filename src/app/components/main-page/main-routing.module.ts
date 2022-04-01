import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';
import { MainAccountComponent } from './main-account/main-account.component';
import { MainActiveSessionsComponent } from './main-active-sessions/main-active-sessions.component';
import { MainAnnouncementComponent } from './main-announcement/main-announcement.component';
import { MainCatalogComponent } from './main-catalog/main-catalog.component';
import { MainHelpComponent } from './main-help/main-help.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces/main-my-workspaces.component';
import { MainPageComponent } from './main-page.component';
import { MainStatisticsComponent } from './main-statistics/main-statistics.component';
import { MainSystemStatusComponent } from './main-system-status/main-system-status.component';
import { MainUsersComponent } from './main-users/main-users.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner/main-workspace-owner.component';

export const routes: Routes = [
  {
    path: 'main', component: MainPageComponent,
    children: [
      {
        path: '', redirectTo: 'catalog', pathMatch: 'full'
      },
      {
        path: 'catalog', component: MainCatalogComponent,
        data: {
          title: 'Applications',
          identifier: 'catalog',
          breadcrumbs: ['home']
        }
      },
      {
        path: 'my-workspaces', component: MainMyWorkspacesComponent,
        data: {
          title: 'My workspaces',
          identifier: 'my-workspace',
          breadcrumbs: ['home', 'My workspaces']
        }
      },
      {
        path: 'workspace-owner', component: MainWorkspaceOwnerComponent,
        data: {
          title: 'Manage workspaces',
          identifier: 'workspace-owner',
          breadcrumbs: ['home', 'workspace-owner']
        }
      },
      {
        path: 'account', component: MainAccountComponent,
        data: {
          title: 'Account',
          identifier: 'account',
          breadcrumbs: ['home', 'account']
        }
      },
      {
        path: 'announcements', component: MainAnnouncementComponent,
        data: {
          title: 'Announcements',
          identifier: 'announcements',
          breadcrumbs: ['home', 'announcements']
        }
      },
      {
        path: 'help', component: MainHelpComponent,
        data: {
          title: 'Help',
          identifier: 'help',
          breadcrumbs: ['home', 'workspace-owner']
        }
      },

      {
        path: 'active-sessions', component: MainActiveSessionsComponent,
        data: {
          title: 'Active sessions',
          identifier: 'active-session',
          breadcrumbs: ['home', 'active-session']
        }
      },
      {
        path: 'users', component: MainUsersComponent,
        data: {
          title: 'Users',
          identifier: 'users',
          breadcrumbs: ['home', 'users']
        }
      },
      {
        path: 'system-status', component: MainSystemStatusComponent,
        data: {
          title: 'System status',
          identifier: 'system-status',
          breadcrumbs: ['home', 'system-status']
        }
      },
      {
        path: 'statistics', component: MainStatisticsComponent,
        data: {
          title: 'Statistics',
          identifier: 'statistics',
          breadcrumbs: ['home', 'statistics']
        }
      },
      {
        path: '**', component: NotFoundPageComponent,
        data: {
          title: 'Not found',
          identifier: 'not-found',
          breadcrumbs: ['home', 'not-found']
        }
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
