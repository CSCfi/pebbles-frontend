import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MaterialModule } from 'src/app/material.module';

import { MainContentStateComponent } from './main-content-state.component';

describe('MainContentStateComponent', () => {
  let component: MainContentStateComponent;
  let fixture: ComponentFixture<MainContentStateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule
      ],
      declarations: [ MainContentStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainContentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
