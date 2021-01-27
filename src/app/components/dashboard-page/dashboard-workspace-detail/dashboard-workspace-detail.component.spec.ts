import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardWorkspaceDetailComponent } from './dashboard-workspace-detail.component';
import { MaterialModule } from 'src/app/material.module';

describe('DashboardWorkspaceDetailComponent', () => {
  let component: DashboardWorkspaceDetailComponent;
  let fixture: ComponentFixture<DashboardWorkspaceDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardWorkspaceDetailComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
