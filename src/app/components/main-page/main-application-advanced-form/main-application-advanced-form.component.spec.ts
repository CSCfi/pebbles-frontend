import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainApplicationAdvancedFormComponent } from './main-application-advanced-form.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MaterialModule } from "../../../material.module";
import { MainSearchBoxComponent } from "../main-search-box/main-search-box.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";

describe('MainApplicationAdvancedFormComponent', () => {
  let component: MainApplicationAdvancedFormComponent;
  let fixture: ComponentFixture<MainApplicationAdvancedFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainApplicationAdvancedFormComponent, MainSearchBoxComponent
      ],
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
        FormBuilder
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainApplicationAdvancedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
