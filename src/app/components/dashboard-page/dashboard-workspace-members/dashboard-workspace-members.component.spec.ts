import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardWorkspaceMembersComponent } from './dashboard-workspace-members.component';
import { MaterialModule } from 'src/app/material.module';

describe('DashboardWorkspaceMembersComponent', () => {
  let component: DashboardWorkspaceMembersComponent;
  let fixture: ComponentFixture<DashboardWorkspaceMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardWorkspaceMembersComponent ],
      imports: [
        HttpClientTestingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
