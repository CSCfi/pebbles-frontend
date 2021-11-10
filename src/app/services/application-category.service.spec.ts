import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { ApplicationCategoryService } from './application-category.service';

describe('ApplicationCategoryService', () => {
  let service: ApplicationCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
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
