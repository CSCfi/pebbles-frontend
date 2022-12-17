import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

import { ServiceAnnouncementService } from './service-announcement.service';

describe('ServiceAnnouncementService', () => {
  let service: ServiceAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    });
    service = TestBed.inject(ServiceAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
