import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';
import * as TESTDATA from '../interceptors/mock-data';
import { ApplicationSessionService } from './application-session.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';


describe('ApplicationSessionService', () => {
  let service: ApplicationSessionService;

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
        // the mock GET filters out deleted sessions, so the fetched list only
        // contains the non-deleted ones (failed sessions are still returned)
        const expected = TESTDATA.db.application_sessions.filter(s => s.state !== 'deleted').length;
        expect(sessions.length).toBe(expected);
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

  it('should count a launch that is still in flight',
    (done: DoneFn) => {
      service.createSession('1').subscribe();
      // the POST has not come back yet, so only the pending counter knows about the launch
      expect(service.getSessions().length).toBe(0);
      expect(service.getSessionCount()).toBe(1);
      setTimeout(() => {
        // the created session has taken over from the pending slot
        expect(service.getSessionCount()).toBe(service.getSessions().length);
        done();
      }, 200);
    }
  );

  it('should release a pending launch that never completes',
    () => {
      const subscription = service.createSession('1').subscribe();
      expect(service.getSessionCount()).toBe(1);
      subscription.unsubscribe();
      expect(service.getSessionCount()).toBe(0);
    }
  );
});
