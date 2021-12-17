import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MainApplicationItemComponent } from './main-application-item.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainApplicationItemComponent', () => {
  let component: MainApplicationItemComponent;
  let fixture: ComponentFixture<MainApplicationItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [ MainApplicationItemComponent ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
   })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainApplicationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
