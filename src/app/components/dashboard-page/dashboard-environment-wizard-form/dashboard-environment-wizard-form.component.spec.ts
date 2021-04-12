import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { DashboardSearchBoxComponent } from '../dashboard-search-box/dashboard-search-box.component';
import { DashboardEnvironmentWizardFormComponent } from './dashboard-environment-wizard-form.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('DashboardEnvironmentWizardFormComponent', () => {
  let component: DashboardEnvironmentWizardFormComponent;
  let fixture: ComponentFixture<DashboardEnvironmentWizardFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [
        DashboardEnvironmentWizardFormComponent,
        DashboardSearchBoxComponent
       ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: {}
        }
     ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEnvironmentWizardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
