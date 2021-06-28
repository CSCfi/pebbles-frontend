import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { InstancePageComponent } from './instance-page.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { MaterialModule } from 'src/app/material.module';

describe('InstancePageComponent', () => {
  let component: InstancePageComponent;
  let fixture: ComponentFixture<InstancePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [InstancePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstancePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
