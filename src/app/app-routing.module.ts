import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { MainRoutingModule } from './components/main-page/main-routing.module';
import { SessionPageComponent } from './components/session-page/session-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  // ---- Development deployment fallback for missing oauth2-proxy sign_out
  { path: 'oauth2/sign_out', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'welcome', component: WelcomePageComponent,
    data: {
      title: 'Welcome',
      identifier: 'welcome',
      breadcrumbs: ['welcome']
    }
  },
  { path: 'main', loadChildren: () => import('./components/main-page/main-routing.module').then(m => m.default)},
  { path: 'session/:id', component: SessionPageComponent,
    data: {
      title: 'Session',
      identifier: 'session',
      breadcrumbs: ['session']
    }},
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      onSameUrlNavigation: 'reload'
    }),
    MainRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
