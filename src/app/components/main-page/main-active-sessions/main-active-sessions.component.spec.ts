import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainActiveSessionsComponent } from './main-active-sessions.component';
import { MaterialModule } from 'src/app/material.module';

describe('MainActiveSessionsComponent', () => {
  let component: MainActiveSessionsComponent;
  let fixture: ComponentFixture<MainActiveSessionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [
        MainActiveSessionsComponent,
        MainContentHeaderComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainActiveSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
