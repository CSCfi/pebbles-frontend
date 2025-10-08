import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

import { ApplicationTemplateService } from './application-template.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ApplicationTemplateService', () => {
  let service: ApplicationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ApplicationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
