import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomImageService } from './custom-image.service';
import { ENVIRONMENT_SPECIFIC_PROVIDERS } from "src/environments/environment";

describe('CustomImageServiceService', () => {
  let service: CustomImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ENVIRONMENT_SPECIFIC_PROVIDERS,
      ]
    });
    service = TestBed.inject(CustomImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
