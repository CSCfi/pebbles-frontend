import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentSessionService } from './environment-session.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import * as TESTDATA from '../interceptors/test-data';
import {RouterTestingModule} from '@angular/router/testing';


describe('EnvironmentSessionService', () => {
  let service: EnvironmentSessionService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    });
    service = TestBed.inject(EnvironmentSessionService);
    localStorage.removeItem('mock.database');
    localStorage.setItem('user_id', '1');
    localStorage.setItem('user_name', 'admin@example.org');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate sessions with fetchSessions',
    (done: DoneFn) => {
      service.fetchSessions().subscribe(() => {
        const sessions = service.getAllSessions();
        // two (deleted, failed) invalid sessions in the database
        // TODO: when UI can handle failed sessions, check the expected number below
        expect(sessions.length).toBe(TESTDATA.db.environment_sessions.length - 1);
        done();
      });
    }
  );

  it('should create a session',
    (done: DoneFn) => {
      service.createSession('1').subscribe(resp => {
        expect(resp.environment_id).toBe('1');
        done();
      });
    }
  );
});
