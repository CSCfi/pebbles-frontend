import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainWorkspaceCustomImagesComponent } from './main-workspace-custom-images.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../../material.module";
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from "../../../../environments/environment";

describe('MainWorkspaceCustomImagesComponent', () => {
  let component: MainWorkspaceCustomImagesComponent;
  let fixture: ComponentFixture<MainWorkspaceCustomImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceCustomImagesComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    fixture = TestBed.createComponent(MainWorkspaceCustomImagesComponent);
    component = fixture.componentInstance;
    component.workspace = {
      id: 'workspace-123',
      join_code: 'string',
      name: 'string',
      description: 'string',
      create_ts: 111,
      expiry_ts: 111,
      owner_ext_id: 'string',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
