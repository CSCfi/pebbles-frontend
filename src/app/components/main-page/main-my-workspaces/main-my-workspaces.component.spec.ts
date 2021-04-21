import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainMyWorkspacesComponent } from './main-my-workspaces.component';

describe('MainMyWorkspacesComponent', () => {
  let component: MainMyWorkspacesComponent;
  let fixture: ComponentFixture<MainMyWorkspacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MaterialModule,
        RouterTestingModule
      ],
      declarations: [
        MainMyWorkspacesComponent,
        MainContentHeaderComponent
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