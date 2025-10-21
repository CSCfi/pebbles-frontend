import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';

import { MainAccountComponent } from './main-account.component';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('MainAccountComponent', () => {
  let component: MainAccountComponent;
  let fixture: ComponentFixture<MainAccountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainAccountComponent,
        MainContentHeaderComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MaterialModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
