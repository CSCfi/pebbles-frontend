import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

import { ApplicationTemplateService } from './application-template.service';

describe('ApplicationTemplateService', () => {
  let service: ApplicationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    });
    service = TestBed.inject(ApplicationTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
