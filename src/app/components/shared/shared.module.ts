import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MaterialModule } from 'src/app/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { DialogComponent } from 'src/app/components/shared/dialog/dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    MaterialModule,
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    // DialogComponent
  ],
})
export class SharedModule { }
