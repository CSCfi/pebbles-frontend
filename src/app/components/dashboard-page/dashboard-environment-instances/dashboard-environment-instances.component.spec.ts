import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DashboardEnvironmentInstancesComponent} from './dashboard-environment-instances.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DashboardEnvironmentInstancesComponent', () => {
  let component: DashboardEnvironmentInstancesComponent;
  let fixture: ComponentFixture<DashboardEnvironmentInstancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [
        DashboardEnvironmentInstancesComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEnvironmentInstancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
