// ---- Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// ---- Custom Modules
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
// ---- Page Modules
import { DashboardModule } from './components/dashboard-page/dashboard.module';
// ---- Services
import { AuthService } from 'src/app/services/auth.service';
import { EnvironmentService } from 'src/app/services/environment.service';
import { InstanceService } from 'src/app/services/instance.service';
import { MessageService } from 'src/app/services/message.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
// ---- Components
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { WelcomeHeaderComponent } from './components/welcome-page/welcome-header/welcome-header.component';
import { WelcomeFooterComponent } from './components/welcome-page/welcome-footer/welcome-footer.component';
import { WelcomeLoginComponent } from './components/welcome-page/welcome-login/welcome-login.component';
import { WelcomePublicityComponent } from './components/welcome-page/welcome-publicity/welcome-publicity.component';
import { InstancePageComponent } from './components/instance-page/instance-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { HeaderComponent } from './components/common/header/header.component';
// ---- Interceptors
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    WelcomePageComponent,
    WelcomeHeaderComponent,
    WelcomeFooterComponent,
    WelcomeLoginComponent,
    WelcomePublicityComponent,
    InstancePageComponent,
    HeaderComponent,
  ],
  exports: [
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    DashboardModule,
    MaterialModule,
  ],
  providers: [
    AuthService,
    EnvironmentService,
    InstanceService,
    MessageService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ENVIRONMENT_SPECIFIC_PROVIDERS,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
