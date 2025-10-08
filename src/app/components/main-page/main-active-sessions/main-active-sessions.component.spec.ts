import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainActiveSessionsComponent } from './main-active-sessions.component';
import { MaterialModule } from 'src/app/material.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from "../../../../environments/environment";

describe('MainActiveSessionsComponent', () => {
  let component: MainActiveSessionsComponent;
  let fixture: ComponentFixture<MainActiveSessionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainActiveSessionsComponent,
        MainContentHeaderComponent
      ],
      imports: [
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainActiveSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
