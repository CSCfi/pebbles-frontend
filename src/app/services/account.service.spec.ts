import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';

describe('AccountService', () => {
  let service: AccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS,
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
