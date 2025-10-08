import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';

import { MainJoinWorkspaceDialogComponent } from './main-join-workspace-dialog.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MainJoinWorkspaceDialogComponent', () => {
  let component: MainJoinWorkspaceDialogComponent;
  let fixture: ComponentFixture<MainJoinWorkspaceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainJoinWorkspaceDialogComponent
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule],
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
