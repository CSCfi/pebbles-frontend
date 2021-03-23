import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardWorkspaceEnvironmentsComponent } from './dashboard-workspace-environments.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardWorkspaceEnvironmentsComponent', () => {
  let component: DashboardWorkspaceEnvironmentsComponent;
  let fixture: ComponentFixture<DashboardWorkspaceEnvironmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [ DashboardWorkspaceEnvironmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
