import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import * as TESTDATA from '../interceptors/mock-data';
import { ApplicationSessionService } from './application-session.service';


describe('ApplicationSessionService', () => {
  let service: ApplicationSessionService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    });
    service = TestBed.inject(ApplicationSessionService);
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
        expect(sessions.length).toBe(TESTDATA.db.application_sessions.length - 1);
        done();
      });
    }
  );

  it('should create a session',
    (done: DoneFn) => {
      service.createSession('1').subscribe(resp => {
        expect(resp.application_id).toBe('1');
        done();
      });
    }
  );
});
