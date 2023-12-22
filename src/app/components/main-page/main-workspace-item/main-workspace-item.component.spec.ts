import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceItemComponent } from './main-workspace-item.component';

describe('MainWorkspaceItemComponent', () => {
  let component: MainWorkspaceItemComponent;
  let fixture: ComponentFixture<MainWorkspaceItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainWorkspaceItemComponent,
      ],
      imports: [
        RouterModule.forRoot([], {}),
        RouterTestingModule,
        HttpClientTestingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWorkspaceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
