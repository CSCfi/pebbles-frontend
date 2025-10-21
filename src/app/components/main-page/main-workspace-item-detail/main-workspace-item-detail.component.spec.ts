import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceItemDetailComponent } from './main-workspace-item-detail.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainWorkspaceItemDetailComponent', () => {
  let component: MainWorkspaceItemDetailComponent;
  let fixture: ComponentFixture<MainWorkspaceItemDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceItemDetailComponent],
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWorkspaceItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
