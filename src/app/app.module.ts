// ---- Modules
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AlertService } from './services/alert.service';
import { DesktopNotificationService } from './services/desktop-notification.service';
import { ApplicationCategoryService } from './services/application-category.service';
import { ApplicationTemplateService } from './services/application-template.service';
import { EventService } from './services/event.service';
import { FaqService } from './services/faq.service';
import { PublicConfigService } from './services/public-config.service';
import { SearchService } from './services/search.service';
import { ServiceAnnouncementService } from './services/service-announcement.service';
import { SystemNotificationService } from './services/system-notification.service';
import { WorkspaceService } from './services/workspace.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
// ---- Components
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { WelcomeLoginComponent } from './components/welcome-page/welcome-login/welcome-login.component';
import { WelcomeBackgroundComponent } from './components/welcome-page/welcome-background/welcome-background.component';
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
    SessionPageComponent,
    WelcomeBackgroundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    MainModule,
  ],
  providers: [
    AccountService,
    AlertService,
    ApplicationService,
    ApplicationCategoryService,
    ApplicationSessionService,
    ApplicationTemplateService,
    AuthService,
    DesktopNotificationService,
    EventService,
    FaqService,
    MessageService,
    PublicConfigService,
    SearchService,
    ServiceAnnouncementService,
    SystemNotificationService,
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
