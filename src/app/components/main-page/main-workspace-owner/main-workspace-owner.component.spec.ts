import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainWorkspaceOwnerComponent } from './main-workspace-owner.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ServiceAnnouncementComponent } from "../../shared/service-announcement/service-announcement.component";
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainWorkspaceOwnerComponent', () => {
  let component: MainWorkspaceOwnerComponent;
  let fixture: ComponentFixture<MainWorkspaceOwnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainWorkspaceOwnerComponent,
        MainContentHeaderComponent,
        ServiceAnnouncementComponent,
      ],
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
    fixture = TestBed.createComponent(MainWorkspaceOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
