import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS,
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow login',
    (done: DoneFn) => {
      return service.login('admin@example.org', 'admin').subscribe(resp => {
        expect(resp).toEqual({
          token: 'fake-token',
          user_id: '1',
          is_admin: true,
          is_workspace_owner: true,
          is_workspace_manager: true
        });
        done();
      });
    });
});
