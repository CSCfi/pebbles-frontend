import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCustomImageFormComponent } from './main-custom-image-form.component';

describe('MainCustomImageFormComponent', () => {
  let component: MainCustomImageFormComponent;
  let fixture: ComponentFixture<MainCustomImageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainCustomImageFormComponent]
    });
    fixture = TestBed.createComponent(MainCustomImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
