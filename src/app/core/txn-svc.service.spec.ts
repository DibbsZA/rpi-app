import { TestBed, inject } from '@angular/core/testing';

import { TxnSvcService } from './txn-svc.service';

describe('TxnSvcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxnSvcService]
    });
  });

  it('should be created', inject([TxnSvcService], (service: TxnSvcService) => {
    expect(service).toBeTruthy();
  }));
});
