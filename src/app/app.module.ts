// ---- Modules
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// ---- Custom Modules
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './components/shared/shared.module';
import { MainModule } from './components/main-page/main.module';
// ---- Services
import { AuthService } from 'src/app/services/auth.service';
import { ApplicationService } from 'src/app/services/application.service';
import { ApplicationSessionService } from 'src/app/services/application-session.service';
import { MessageService } from 'src/app/services/message.service';
import { AccountService } from './services/account.service';
import { DesktopNotificationService } from './services/desktop-notification.service';
import { ApplicationCategoryService } from './services/application-category.service';
import { ApplicationTemplateService } from './services/application-template.service';
import { FaqService } from './services/faq.service';
import { WorkspaceService } from './services/workspace.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
// ---- Components
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { WelcomeLoginComponent } from './components/welcome-page/welcome-login/welcome-login.component';
import { WelcomeBackgroundComponent } from './components/welcome-page/welcome-background/welcome-background.component';
import { WelcomePublicityComponent } from './components/welcome-page/welcome-publicity/welcome-publicity.component';
import { SessionPageComponent } from './components/session-page/session-page.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
// ---- Interceptors
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    WelcomePageComponent,
    WelcomeLoginComponent,
    WelcomePublicityComponent,
    SessionPageComponent,
    WelcomeBackgroundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    SharedModule,
    MainModule,
  ],
  providers: [
    AccountService,
    AuthService,
    DesktopNotificationService,
    ApplicationService,
    ApplicationCategoryService,
    ApplicationTemplateService,
    FaqService,
    ApplicationSessionService,
    MessageService,
    WorkspaceService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ENVIRONMENT_SPECIFIC_PROVIDERS,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
