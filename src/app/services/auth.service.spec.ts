import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
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
