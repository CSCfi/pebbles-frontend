import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainWorkspaceMembersComponent } from './main-workspace-members.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { RouterTestingModule } from '@angular/router/testing';

describe('MainWorkspaceMembersComponent', () => {
  let component: MainWorkspaceMembersComponent;
  let fixture: ComponentFixture<MainWorkspaceMembersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainWorkspaceMembersComponent ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainWorkspaceMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
