import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';
import { ApplicationCategoryService } from './application-category.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('ApplicationCategoryService', () => {
  let service: ApplicationCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ApplicationCategoryService);
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
