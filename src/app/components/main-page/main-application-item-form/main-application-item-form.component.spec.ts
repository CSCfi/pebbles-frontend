import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainApplicationItemFormComponent } from './main-application-item-form.component';
import { MainSearchBoxComponent } from '../main-search-box/main-search-box.component';

describe('MainApplicationItemFormComponent', () => {
  let component: MainApplicationItemFormComponent;
  let fixture: ComponentFixture<MainApplicationItemFormComponent>;

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
        MainApplicationItemFormComponent,
        MainSearchBoxComponent
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
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainApplicationItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
