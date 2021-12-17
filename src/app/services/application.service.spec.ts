import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  let service: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS
      ]
    });
    service = TestBed.inject(ApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate applications with fetchApplications',
    (done: DoneFn) => {
      service.fetchApplications().subscribe((resp) => {
        expect(resp.length).toBeGreaterThan(0);
        done();
      });
    }
  );
});
