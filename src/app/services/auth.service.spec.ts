import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { User } from 'src/app/models/user';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS, MatSnackBar]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should allow login',
    (done: DoneFn) => {
      return service.login(new User(null, null, 'admin@example.org', 'admin')).then((resp) => {
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
