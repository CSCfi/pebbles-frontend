import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardWorkspaceFoldersComponent } from './dashboard-workspace-folders.component';

describe('DashboardWorkspaceFoldersComponent', () => {
  let component: DashboardWorkspaceFoldersComponent;
  let fixture: ComponentFixture<DashboardWorkspaceFoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardWorkspaceFoldersComponent ],
      imports: [
        HttpClientTestingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
