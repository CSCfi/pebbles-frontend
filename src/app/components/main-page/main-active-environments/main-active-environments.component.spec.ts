import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MainContentHeaderComponent } from '../main-content-header/main-content-header.component';
import { MainActiveEnvironmentsComponent } from './main-active-environments.component';
import { MaterialModule } from 'src/app/material.module';

describe('MainActiveEnvironmentsComponent', () => {
  let component: MainActiveEnvironmentsComponent;
  let fixture: ComponentFixture<MainActiveEnvironmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule
      ],
      declarations: [
        MainActiveEnvironmentsComponent,
        MainContentHeaderComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainActiveEnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
