import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceItemDetailComponent } from './main-workspace-item-detail.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from "../../../../environments/environment";

describe('MainWorkspaceItemDetailComponent', () => {
  let component: MainWorkspaceItemDetailComponent;
  let fixture: ComponentFixture<MainWorkspaceItemDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceItemDetailComponent],
      imports: [
        RouterTestingModule,
        MaterialModule,
        ReactiveFormsModule],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
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
