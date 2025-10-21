import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceFormComponent } from './main-workspace-form.component';
import { DateDisplayPipe } from "../../../pipes/date-display.pipe";
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainWorkspaceFormComponent', () => {
  let component: MainWorkspaceFormComponent;
  let fixture: ComponentFixture<MainWorkspaceFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceFormComponent, DateDisplayPipe],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatDialogModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            isCreationMode: true
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
    fixture = TestBed.createComponent(MainWorkspaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
