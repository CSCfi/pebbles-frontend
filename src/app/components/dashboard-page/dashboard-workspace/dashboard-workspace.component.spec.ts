import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardWorkspaceComponent } from './dashboard-workspace.component';
import { MaterialModule } from 'src/app/material.module';
import { DashboardBreadcrumbComponent } from '../dashboard-breadcrumb/dashboard-breadcrumb.component';

describe('DashboardWorkspaceComponent', () => {
  let component: DashboardWorkspaceComponent;
  let fixture: ComponentFixture<DashboardWorkspaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [
        DashboardWorkspaceComponent,
        DashboardBreadcrumbComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
