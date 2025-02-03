import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '../../../material.module';

import { MainSelectCustomImageDialogComponent } from './main-select-custom-image-dialog.component';

describe('MainSelectWorkspaceDialogComponent', () => {
  let component: MainSelectCustomImageDialogComponent;
  let fixture: ComponentFixture<MainSelectCustomImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule,
      ],
      declarations: [MainSelectCustomImageDialogComponent],
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
        }
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainSelectCustomImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
