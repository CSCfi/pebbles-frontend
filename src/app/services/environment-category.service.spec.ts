import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { EnvironmentCategoryService } from './environment-category.service';
import { DashboardCatalogComponent } from '../components/dashboard-page/dashboard-catalog/dashboard-catalog.component';

describe('EnvironmentCategoryService', () => {
  let service: EnvironmentCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        DashboardCatalogComponent
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    });
    service = TestBed.inject(EnvironmentCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate catalog with fetchCategories',
    (done: DoneFn) => {
      service.fetchCategories().subscribe((resp) => {
        expect(resp.length).toBeGreaterThan(0);
        done();
      });
    }
  );
});
