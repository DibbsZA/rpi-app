import { TestBed, inject } from '@angular/core/testing';

import { PspService } from './psp.service';

describe('PspSvcService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PspService]
        });
    });

    it('should be created', inject([PspService], (service: PspService) => {
        expect(service).toBeTruthy();
    }));
});
