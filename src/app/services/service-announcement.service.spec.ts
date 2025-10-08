import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

import { ServiceAnnouncementService } from './service-announcement.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ServiceAnnouncementService', () => {
  let service: ServiceAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
});
    service = TestBed.inject(ServiceAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
