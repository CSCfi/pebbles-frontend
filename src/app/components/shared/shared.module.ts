import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MaterialModule } from 'src/app/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
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
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
})
export class SharedModule { }
