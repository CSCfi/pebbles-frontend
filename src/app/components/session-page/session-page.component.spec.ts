import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { SessionPageComponent } from './session-page.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MaterialModule } from 'src/app/material.module';

describe('SessionPageComponent', () => {
  let component: SessionPageComponent;
  let fixture: ComponentFixture<SessionPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([], {}),
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [SessionPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
