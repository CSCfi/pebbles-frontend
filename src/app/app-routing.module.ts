import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { MainRoutingModule } from './components/main-page/main-routing.module';
import { InstancePageComponent } from './components/instance-page/instance-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  // ---- Fix each SSO login path later
  { path: 'haka-login', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'csc-login', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'virtu-login', redirectTo: 'welcome', pathMatch: 'full' },
  // ---- //
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'main', loadChildren: './components/main-page/main-routing.module'},
  { path: 'instance/:id', component: InstancePageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    MainRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
