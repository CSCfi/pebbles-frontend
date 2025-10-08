import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CustomImageService } from './custom-image.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from "src/environments/environment";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CustomImageService', () => {
  let service: CustomImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CustomImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
