import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';

import { MainJoinWorkspaceDialogComponent } from './main-join-workspace-dialog.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainJoinWorkspaceDialogComponent', () => {
  let component: MainJoinWorkspaceDialogComponent;
  let fixture: ComponentFixture<MainJoinWorkspaceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainJoinWorkspaceDialogComponent,
      ],
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            context: {
              identifier: 'catalog'
            }
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
    fixture = TestBed.createComponent(MainJoinWorkspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
