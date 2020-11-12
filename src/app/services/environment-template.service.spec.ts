import { TestBed } from '@angular/core/testing';

import { EnvironmentTemplateService } from './environment-template.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardCatalogComponent } from '../components/dashboard-page/dashboard-catalog/dashboard-catalog.component';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

describe('EnvironmentTemplateService', () => {
  let service: EnvironmentTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    });
    service = TestBed.inject(EnvironmentTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
