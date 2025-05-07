import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainWorkspaceCustomImagesComponent } from './main-workspace-custom-images.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../../material.module";
import {MembershipExpiryPolicy, MembershipType, WorkspaceConfig} from "../../../models/workspace";

describe('MainWorkspaceCustomImagesComponent', () => {
  let component: MainWorkspaceCustomImagesComponent;
  let fixture: ComponentFixture<MainWorkspaceCustomImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
      ],
      declarations: [MainWorkspaceCustomImagesComponent],

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
