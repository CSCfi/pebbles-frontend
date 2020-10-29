import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardBreadcrumbComponent } from '../dashboard-breadcrumb/dashboard-breadcrumb.component';
import { DashboardWorkspaceWizardComponent } from './dashboard-workspace-wizard.component';

describe('DashboardWorkspaceWizardComponent', () => {
  let component: DashboardWorkspaceWizardComponent;
  let fixture: ComponentFixture<DashboardWorkspaceWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardWorkspaceWizardComponent,
        DashboardBreadcrumbComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
