import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceApplicationsComponent } from './main-workspace-applications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MainWorkspaceApplicationsComponent', () => {
  let component: MainWorkspaceApplicationsComponent;
  let fixture: ComponentFixture<MainWorkspaceApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainWorkspaceApplicationsComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWorkspaceApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
