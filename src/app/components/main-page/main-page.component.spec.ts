import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';

import { MainPageComponent } from './main-page.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MainPageComponent', () => {
  let component: MainPageComponent;
  let fixture: ComponentFixture<MainPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS,
      ],
      declarations: [ MainPageComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
