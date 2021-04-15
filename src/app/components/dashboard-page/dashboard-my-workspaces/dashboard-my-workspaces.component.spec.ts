import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DashboardContentHeaderComponent } from '../dashboard-content-header/dashboard-content-header.component';
import { DashboardMyWorkspacesComponent } from './dashboard-my-workspaces.component';

describe('DashboardMyWorkspacesComponent', () => {
  let component: DashboardMyWorkspacesComponent;
  let fixture: ComponentFixture<DashboardMyWorkspacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [
        DashboardMyWorkspacesComponent,
        DashboardContentHeaderComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardMyWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
