import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCustomImageFormComponent } from './main-custom-image-form.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../../material.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

describe('MainCustomImageFormComponent', () => {
  let component: MainCustomImageFormComponent;
  let fixture: ComponentFixture<MainCustomImageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
      ],
      declarations: [MainCustomImageFormComponent],
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
    });
    fixture = TestBed.createComponent(MainCustomImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
