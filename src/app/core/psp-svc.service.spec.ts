import { TestBed, inject } from '@angular/core/testing';

import { PspSvcService } from './psp-svc.service';

describe('PspSvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PspSvcService]
    });
  });

  it('should be created', inject([PspSvcService], (service: PspSvcService) => {
    expect(service).toBeTruthy();
  }));
});
