import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';

import { PublicConfigService } from './public-config.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('PublicConfigService', () => {
  let service: PublicConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(PublicConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
