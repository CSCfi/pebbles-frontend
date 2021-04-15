import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';

import { DashboardAnnouncementComponent } from './dashboard-announcement.component';
import { DashboardContentHeaderComponent } from '../dashboard-content-header/dashboard-content-header.component';

describe('DashboardAnnouncementComponent', () => {
  let component: DashboardAnnouncementComponent;
  let fixture: ComponentFixture<DashboardAnnouncementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [
        DashboardAnnouncementComponent,
        DashboardContentHeaderComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
