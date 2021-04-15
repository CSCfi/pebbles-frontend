import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DashboardContentHeaderComponent } from '../dashboard-content-header/dashboard-content-header.component';
import { DashboardActiveEnvironmentsComponent } from './dashboard-active-environments.component';

describe('DashboardActiveEnvironmentsComponent', () => {
  let component: DashboardActiveEnvironmentsComponent;
  let fixture: ComponentFixture<DashboardActiveEnvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        DashboardActiveEnvironmentsComponent,
        DashboardContentHeaderComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardActiveEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
