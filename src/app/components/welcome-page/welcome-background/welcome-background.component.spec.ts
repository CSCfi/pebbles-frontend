import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeBackgroundComponent } from './welcome-background.component';

describe('WelcomeBackgroundComponent', () => {
  let component: WelcomeBackgroundComponent;
  let fixture: ComponentFixture<WelcomeBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WelcomeBackgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
