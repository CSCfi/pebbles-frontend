import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material.module';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces.component';

describe('MainMyWorkspacesComponent', () => {
  let component: MainMyWorkspacesComponent;
  let fixture: ComponentFixture<MainMyWorkspacesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainMyWorkspacesComponent,
        MainContentHeaderComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
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
