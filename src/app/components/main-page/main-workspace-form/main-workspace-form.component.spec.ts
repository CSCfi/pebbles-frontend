import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceFormComponent } from './main-workspace-form.component';

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
        MatDialogModule
      ],
      declarations: [ MainWorkspaceFormComponent ],
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
        }
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
