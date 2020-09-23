import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFooterComponent } from './welcome-footer.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../../../environments/environment';

describe('WelcomeFooterComponent', () => {
  let component: WelcomeFooterComponent;
  let fixture: ComponentFixture<WelcomeFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WelcomeFooterComponent],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
