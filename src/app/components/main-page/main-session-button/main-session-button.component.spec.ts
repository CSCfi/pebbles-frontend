import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';

import { MainSessionButtonComponent } from './main-session-button.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from "../../../../environments/environment";

describe('MainSessionButtonComponent', () => {
  let component: MainSessionButtonComponent;
  let fixture: ComponentFixture<MainSessionButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainSessionButtonComponent],
      imports: [
        RouterTestingModule,
        MaterialModule],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSessionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
