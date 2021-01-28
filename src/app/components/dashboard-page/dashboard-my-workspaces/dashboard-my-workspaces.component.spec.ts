import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardMyWorkspacesComponent } from './dashboard-my-workspaces.component';
import { MaterialModule } from 'src/app/material.module';

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
