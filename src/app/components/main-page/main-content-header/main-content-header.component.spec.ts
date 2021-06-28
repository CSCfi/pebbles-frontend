import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MainContentHeaderComponent } from './main-content-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('MainContentHeaderComponent', () => {
  let component: MainContentHeaderComponent;
  let fixture: ComponentFixture<MainContentHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule
      ],
      declarations: [ MainContentHeaderComponent ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
