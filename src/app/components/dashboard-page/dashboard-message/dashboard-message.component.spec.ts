import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { DashboardMessageComponent } from './dashboard-message.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardBreadcrumbComponent } from '../dashboard-breadcrumb/dashboard-breadcrumb.component';
import { MaterialModule } from 'src/app/material.module';

describe('DashboardMessageComponent', () => {
  let component: DashboardMessageComponent;
  let fixture: ComponentFixture<DashboardMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
      declarations: [
        DashboardMessageComponent,
        DashboardBreadcrumbComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
