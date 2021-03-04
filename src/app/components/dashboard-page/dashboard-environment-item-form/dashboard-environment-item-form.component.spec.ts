import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardEnvironmentItemFormComponent } from './dashboard-environment-item-form.component';
import { DashboardSearchBoxComponent } from '../dashboard-search-box/dashboard-search-box.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('DashboardEnvironmentItemFormComponent', () => {
  let component: DashboardEnvironmentItemFormComponent;
  let fixture: ComponentFixture<DashboardEnvironmentItemFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule,
      ],
      declarations: [
        DashboardEnvironmentItemFormComponent,
        DashboardSearchBoxComponent
       ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
           // requires first adding environment and then testing to edit
           // environment: Environment
          }
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
    fixture = TestBed.createComponent(DashboardEnvironmentItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
