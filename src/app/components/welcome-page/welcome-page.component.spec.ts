import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';
import { MaterialModule } from 'src/app/material.module';
import { WelcomePageComponent } from './welcome-page.component';
import { HttpErrorResponse, HttpHeaders, provideHttpClient, withInterceptors } from '@angular/common/http';

describe('WelcomePageComponent', () => {
  let component: WelcomePageComponent;
  let fixture: ComponentFixture<WelcomePageComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WelcomePageComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        MaterialModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should report an API error from the response body', () => {
    component['setLoginError'](new HttpErrorResponse({status: 401, error: 'Invalid user or password'}));
    expect(component.loginError).toEqual(['Invalid user or password']);
  });

  it('should not report the ingress error page as a login error', () => {
    component['setLoginError'](new HttpErrorResponse({
      status: 503,
      error: '<html><body><h1>Application is not available</h1></body></html>'
    }));
    expect(component.loginError).toEqual(['Cannot connect to the API, please try again later']);
  });

  it('should not report an HTML error page served under any other status', () => {
    component['setLoginError'](new HttpErrorResponse({
      status: 404,
      headers: new HttpHeaders({'content-type': 'text/html'}),
      error: '<html><body><h1>Application is not available</h1></body></html>'
    }));
    expect(component.loginError).toEqual(['Cannot connect to the API, please try again later']);
  });

  it('should not report an unparseable HTML body as a login error', () => {
    component['setLoginError'](new HttpErrorResponse({
      status: 500,
      error: {error: new SyntaxError('Unexpected token <'), text: '<html><body><h1>Application is not available</h1></body></html>'}
    }));
    expect(component.loginError).toEqual(['Cannot connect to the API, please try again later']);
  });

  it('should report something when the response carries no error at all', () => {
    component['setLoginError'](new HttpErrorResponse({status: 500}));
    expect(component.loginError).toEqual(['Login failed, please try again']);
  });
});
