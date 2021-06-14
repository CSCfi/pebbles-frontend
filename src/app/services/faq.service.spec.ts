import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FaqService } from './faq.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from 'src/environments/environment';
import { Overlay } from '@angular/cdk/overlay';

describe('FaqService', () => {
  let service: FaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ENVIRONMENT_SPECIFIC_PROVIDERS, Overlay]
    });
    service = TestBed.inject(FaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
