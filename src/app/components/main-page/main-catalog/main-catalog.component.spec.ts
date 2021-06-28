import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MainCatalogComponent } from './main-catalog.component';
import { MainSearchBoxComponent } from '../main-search-box/main-search-box.component';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';


describe('MainCatalogComponent', () => {
  let component: MainCatalogComponent;
  let fixture: ComponentFixture<MainCatalogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [
        MainCatalogComponent,
        MainSearchBoxComponent,
        MainContentHeaderComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
