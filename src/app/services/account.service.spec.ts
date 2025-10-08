import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(AccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetchAccount',
    (done: DoneFn) => {
      service.fetchAccount('1').subscribe((resp) => {
        expect(resp).toEqual(jasmine.objectContaining({
          id: '1',
          ext_id: 'admin@example.org',
          // password: 'admin',
          is_admin: true,
          is_workspace_owner: true,
          is_workspace_manager: true
        }));
        done();
      });
    }
  );
});
