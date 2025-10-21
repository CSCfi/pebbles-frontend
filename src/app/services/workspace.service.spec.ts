import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { WorkspaceService } from './workspace.service';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from 'src/environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(WorkspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate workspaces with fetchWorkspaces',
    (done: DoneFn) => {
      // ---- Complement user_name when processing with mock data <--- TODO: get better advice
      if (!localStorage.getItem('user_name')) {
        localStorage.setItem('user_name', 'admin@example.org');
      }
      service.fetchWorkspaces().subscribe(() => {
        const workspaces = service.getWorkspaces();
        expect(workspaces.length).toBeGreaterThan(0);
        done();
      });
    }
  );
});
