import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DashboardCatalogComponent } from './dashboard-catalog.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { DashboardBreadcrumbComponent } from '../dashboard-breadcrumb/dashboard-breadcrumb.component';

describe('DashboardCatalogComponent', () => {
  let component: DashboardCatalogComponent;
  let fixture: ComponentFixture<DashboardCatalogComponent>;

  beforeEach(async(() => {
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
        DashboardCatalogComponent,
        DashboardBreadcrumbComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});