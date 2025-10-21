import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ReactiveFormsModule } from "@angular/forms";
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';

describe('MainMyWorkspacesComponent', () => {
  let component: MainMyWorkspacesComponent;
  let fixture: ComponentFixture<MainMyWorkspacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainMyWorkspacesComponent,
        MainContentHeaderComponent,
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
    fixture = TestBed.createComponent(MainMyWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
