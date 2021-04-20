import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MainSearchBoxComponent } from '../main-search-box/main-search-box.component';
import { MainEnvironmentWizardFormComponent } from './main-environment-wizard-form.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('MainEnvironmentWizardFormComponent', () => {
  let component: MainEnvironmentWizardFormComponent;
  let fixture: ComponentFixture<MainEnvironmentWizardFormComponent>;

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
        MainEnvironmentWizardFormComponent,
        MainSearchBoxComponent
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
    fixture = TestBed.createComponent(MainEnvironmentWizardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
