import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';

import { MainMessageComponent } from './main-message.component';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('MainMessageComponent', () => {
  let component: MainMessageComponent;
  let fixture: ComponentFixture<MainMessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainMessageComponent,
        MainContentHeaderComponent,
      ],
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
