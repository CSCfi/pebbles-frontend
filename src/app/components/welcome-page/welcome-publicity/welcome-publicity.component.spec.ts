import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WelcomePublicityComponent } from './welcome-publicity.component';
import { MaterialModule } from 'src/app/material.module';

describe('WelcomePublicityComponent', () => {
  let component: WelcomePublicityComponent;
  let fixture: ComponentFixture<WelcomePublicityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ WelcomePublicityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePublicityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
