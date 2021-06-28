import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MainNavComponent } from './main-nav.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MaterialModule } from 'src/app/material.module';

describe('MainNavComponent', () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [MainNavComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
