import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHelpFaqComponent } from './main-help-faq.component';
import {MainHelpNavComponent} from '../main-help-nav/main-help-nav.component';
import {MainContentHeaderComponent} from '../main-content-header/main-content-header.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MaterialModule} from '../../../material.module';

describe('MainHelpFaqComponent', () => {
  let component: MainHelpFaqComponent;
  let fixture: ComponentFixture<MainHelpFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainHelpFaqComponent,
        MainContentHeaderComponent,
        MainHelpNavComponent
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
    fixture = TestBed.createComponent(MainHelpFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
