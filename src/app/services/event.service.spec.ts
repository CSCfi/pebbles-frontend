import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { ENVIRONMENT_SPECIFIC_INTERCEPTORS } from '../../environments/environment';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe('EventServiceService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors(ENVIRONMENT_SPECIFIC_INTERCEPTORS)),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
