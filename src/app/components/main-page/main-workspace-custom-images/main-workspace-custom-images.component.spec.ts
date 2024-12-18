import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainWorkspaceCustomImagesComponent } from './main-workspace-custom-images.component';

describe('MainWorkspaceCustomImagesComponent', () => {
  let component: MainWorkspaceCustomImagesComponent;
  let fixture: ComponentFixture<MainWorkspaceCustomImagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainWorkspaceCustomImagesComponent]
    });
    fixture = TestBed.createComponent(MainWorkspaceCustomImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
