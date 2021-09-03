import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainEnvironmentItemFormComponent } from './main-environment-item-form.component';
import { MainSearchBoxComponent } from '../main-search-box/main-search-box.component';

describe('MainEnvironmentItemFormComponent', () => {
  let component: MainEnvironmentItemFormComponent;
  let fixture: ComponentFixture<MainEnvironmentItemFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule,
      ],
      declarations: [
        MainEnvironmentItemFormComponent,
        MainSearchBoxComponent
       ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
           // requires first adding environment and then testing to edit
           // environment: Environment
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
    fixture = TestBed.createComponent(MainEnvironmentItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
