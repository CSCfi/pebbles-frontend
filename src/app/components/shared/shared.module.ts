import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MaterialModule } from 'src/app/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DialogComponent } from 'src/app/components/shared/dialog/dialog.component';
import { ServiceAnnouncementComponent } from './service-announcement/service-announcement.component';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../environments/environment";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    ServiceAnnouncementComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ServiceAnnouncementComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    MaterialModule,
    AppRoutingModule,
  ],
  providers: [
    provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
  ]
})
export class SharedModule {
}
