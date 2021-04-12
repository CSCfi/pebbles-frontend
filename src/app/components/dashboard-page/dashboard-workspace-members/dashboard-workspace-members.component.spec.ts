import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardWorkspaceMembersComponent } from './dashboard-workspace-members.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';

describe('DashboardWorkspaceMembersComponent', () => {
  let component: DashboardWorkspaceMembersComponent;
  let fixture: ComponentFixture<DashboardWorkspaceMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardWorkspaceMembersComponent ],
      imports: [
        HttpClientTestingModule,
        MaterialModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
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
