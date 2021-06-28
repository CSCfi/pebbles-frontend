import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainHelpContactComponent } from './main-help-contact.component';
import {MainContentHeaderComponent} from '../main-content-header/main-content-header.component';
import {MainHelpNavComponent} from '../main-help-nav/main-help-nav.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../../material.module';

describe('MainHelpContactComponent', () => {
  let component: MainHelpContactComponent;
  let fixture: ComponentFixture<MainHelpContactComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainContentHeaderComponent,
        MainHelpNavComponent,
        MainHelpContactComponent
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
    fixture = TestBed.createComponent(MainHelpContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
