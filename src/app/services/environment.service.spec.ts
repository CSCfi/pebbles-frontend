import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { EnvironmentService } from './environment.service';
import { DashboardEnvironmentComponent } from '../components/dashboard-page/dashboard-environment/dashboard-environment.component';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        DashboardEnvironmentComponent
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    });
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate environments with fetchEnvironments',
    (done: DoneFn) => {
      service.fetchEnvironments().subscribe((resp) => {
        expect(resp.length).toBeGreaterThan(0);
        done();
      });
    }
  );
});
