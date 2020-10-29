import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardBreadcrumbComponent } from '../dashboard-breadcrumb/dashboard-breadcrumb.component';
import { DashboardWorkspaceOwnerComponent } from './dashboard-workspace-owner.component';

describe('DashboardWorkspaceOwnerComponent', () => {
  let component: DashboardWorkspaceOwnerComponent;
  let fixture: ComponentFixture<DashboardWorkspaceOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardWorkspaceOwnerComponent,
        DashboardBreadcrumbComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
