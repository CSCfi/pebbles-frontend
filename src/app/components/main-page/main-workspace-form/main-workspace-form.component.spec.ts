import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceFormComponent } from './main-workspace-form.component';
import { DateDisplayPipe } from "../../../pipes/date-display.pipe";

describe('MainWorkspaceFormComponent', () => {
  let component: MainWorkspaceFormComponent;
  let fixture: ComponentFixture<MainWorkspaceFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatDialogModule,
      ],
      declarations: [ MainWorkspaceFormComponent, DateDisplayPipe ],
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
