import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainApplicationAdvancedFormComponent } from './main-application-advanced-form.component';
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe('MainApplicationAdvancedFormComponent', () => {
  let component: MainApplicationAdvancedFormComponent;
  let fixture: ComponentFixture<MainApplicationAdvancedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainApplicationAdvancedFormComponent],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainApplicationAdvancedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
