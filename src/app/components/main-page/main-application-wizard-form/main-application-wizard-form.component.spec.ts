import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { MainSearchBoxComponent } from '../main-search-box/main-search-box.component';
import { MainApplicationWizardFormComponent } from './main-application-wizard-form.component';
import {RouterTestingModule} from '@angular/router/testing';

describe('MainApplicationWizardFormComponent', () => {
  let component: MainApplicationWizardFormComponent;
  let fixture: ComponentFixture<MainApplicationWizardFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        MatDialogModule,
        RouterTestingModule
      ],
      declarations: [
        MainApplicationWizardFormComponent,
        MainSearchBoxComponent
       ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
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
    fixture = TestBed.createComponent(MainApplicationWizardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
