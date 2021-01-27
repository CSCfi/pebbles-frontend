import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardWorkspaceItemComponent } from './dashboard-workspace-item.component';

describe('DashboardWorkspaceItemComponent', () => {
  let component: DashboardWorkspaceItemComponent;
  let fixture: ComponentFixture<DashboardWorkspaceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardWorkspaceItemComponent,
      ],
      imports: [
        RouterModule.forRoot([]),
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
