import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../../../environments/environment';
import { MaterialModule } from '../../../material.module';
import { ServiceAnnouncementComponent } from './service-announcement.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('ServiceAnnouncementComponent', () => {
  let component: ServiceAnnouncementComponent;
  let fixture: ComponentFixture<ServiceAnnouncementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAnnouncementComponent],
      imports: [
        RouterModule.forRoot([]),
        MaterialModule,
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
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
