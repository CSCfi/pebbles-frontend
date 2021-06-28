import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WelcomeHeaderComponent } from './welcome-header.component';
import { MaterialModule } from 'src/app/material.module';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('WelcomeHeaderComponent', () => {
  let component: WelcomeHeaderComponent;
  let fixture: ComponentFixture<WelcomeHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [WelcomeHeaderComponent],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
