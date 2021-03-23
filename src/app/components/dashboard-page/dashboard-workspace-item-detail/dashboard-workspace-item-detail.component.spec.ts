import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';
import { DashboardWorkspaceItemDetailComponent } from './dashboard-workspace-item-detail.component';

describe('DashboardWorkspaceItemDetailComponent', () => {
  let component: DashboardWorkspaceItemDetailComponent;
  let fixture: ComponentFixture<DashboardWorkspaceItemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [ DashboardWorkspaceItemDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWorkspaceItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
