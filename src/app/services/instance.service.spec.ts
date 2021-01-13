import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InstanceService } from './instance.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';
import * as TESTDATA from '../interceptors/test-data';


describe('InstanceService', () => {
  let service: InstanceService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    });
    service = TestBed.inject(InstanceService);
    localStorage.removeItem('mock.database');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate instances with fetchInstances',
    (done: DoneFn) => {
      service.fetchInstances().subscribe(() => {
        const instances = service.getInstances();
        // two (deleted, failed) invalid instances in the database
        expect(instances.length).toBe(TESTDATA.db.instances.length - 2);
        done();
      });
    }
  );

  it('should create an instance',
    (done: DoneFn) => {
      service.createInstance('1').subscribe(resp => {
        expect(resp.environment_id).toBe('1');
        done();
      });
    }
  );
});
