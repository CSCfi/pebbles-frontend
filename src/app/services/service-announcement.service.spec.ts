import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';

import { ServiceAnnouncementService } from './service-announcement.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('ServiceAnnouncementService', () => {
  let service: ServiceAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ServiceAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
