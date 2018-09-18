import { TestBed, inject } from '@angular/core/testing';

import { AuthSvcService } from './auth-svc.service';

describe('AuthSvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSvcService]
    });
  });

  it('should be created', inject([AuthSvcService], (service: AuthSvcService) => {
    expect(service).toBeTruthy();
  }));
});
