import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';

import { ApplicationTemplateService } from './application-template.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('ApplicationTemplateService', () => {
  let service: ApplicationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ApplicationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
