import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';

import { MainJoinWorkspaceDialogComponent } from './main-join-workspace-dialog.component';

describe('MainJoinWorkspaceDialogComponent', () => {
  let component: MainJoinWorkspaceDialogComponent;
  let fixture: ComponentFixture<MainJoinWorkspaceDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      declarations: [
        MainJoinWorkspaceDialogComponent
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            content: {
              identifier: 'catalog'
            }
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
    fixture = TestBed.createComponent(MainJoinWorkspaceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
