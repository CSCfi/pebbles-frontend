import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceApplicationsComponent } from './main-workspace-applications.component';
import { RouterModule } from '@angular/router';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('MainWorkspaceApplicationsComponent', () => {
  let component: MainWorkspaceApplicationsComponent;
  let fixture: ComponentFixture<MainWorkspaceApplicationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceApplicationsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
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
    fixture = TestBed.createComponent(MainWorkspaceApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
