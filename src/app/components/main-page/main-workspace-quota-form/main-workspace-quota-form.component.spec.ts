import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import { MaterialModule } from '../../../material.module';

import { MainWorkspaceQuotaFormComponent } from './main-workspace-quota-form.component';

describe('MainWorkspaceQuotaFormComponent', () => {
  let component: MainWorkspaceQuotaFormComponent;
  let fixture: ComponentFixture<MainWorkspaceQuotaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      declarations: [ MainWorkspaceQuotaFormComponent ],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWorkspaceQuotaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
