import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainFooterComponent } from './main-footer.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../../../environments/environment';

describe('MainFooterComponent', () => {
  let component: MainFooterComponent;
  let fixture: ComponentFixture<MainFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFooterComponent ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
