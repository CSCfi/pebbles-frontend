import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

import { PublicConfigService } from './public-config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PublicConfigService', () => {
  let service: PublicConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PublicConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
