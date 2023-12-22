import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MaterialModule } from 'src/app/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DialogComponent } from 'src/app/components/shared/dialog/dialog.component';
import { ServiceAnnouncementComponent } from './service-announcement/service-announcement.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    ServiceAnnouncementComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ServiceAnnouncementComponent,
  ],
})
export class SharedModule { }
