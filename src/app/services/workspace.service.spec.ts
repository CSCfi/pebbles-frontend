import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { WorkspaceService } from './workspace.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';

describe('WorkspaceService', () => {
  let service: WorkspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS,
        MatSnackBar, Overlay
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
      if (!localStorage.getItem('user_name')){
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
