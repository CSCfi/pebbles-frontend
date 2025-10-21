import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';

import { MainSelectWorkspaceDialogComponent } from './main-select-workspace-dialog.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainSelectWorkspaceDialogComponent', () => {
  let component: MainSelectWorkspaceDialogComponent;
  let fixture: ComponentFixture<MainSelectWorkspaceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainSelectWorkspaceDialogComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterModule.forRoot([])
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            // requires first adding application and then testing to edit
            // application: Application
          }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSelectWorkspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
