import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWorkspaceCustomImagesComponent } from './main-workspace-custom-images.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "../../../material.module";

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
