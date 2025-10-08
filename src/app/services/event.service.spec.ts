import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from '../../environments/environment';

describe('EventServiceService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS]
    });
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
