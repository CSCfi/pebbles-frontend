import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../../../environments/environment';
import { MaterialModule } from '../../../material.module';
import { ServiceAnnouncementComponent } from './service-announcement.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ServiceAnnouncementComponent', () => {
  let component: ServiceAnnouncementComponent;
  let fixture: ComponentFixture<ServiceAnnouncementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAnnouncementComponent],
      imports: [
        RouterTestingModule,
        MaterialModule],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create announcement', () => {
    expect(component).toBeTruthy();
  });
});
