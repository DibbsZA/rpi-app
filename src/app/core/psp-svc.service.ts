import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataServiceService } from './data-service.service';
import { AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { iProcessor } from '../models/interfaces';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { msgPSPPayment } from '../models/messages';

// DEFAULT Headers
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

/**
 * Handle communicating with the PSP API.
 *
 * @export
 * @class PspSvcService
 */
@Injectable({
    providedIn: 'root'
})
export class PspSvcService {

    pspCol: AngularFirestoreCollection<iProcessor>;
    pspDoc: AngularFirestoreDocument<iProcessor>;

    pspList: Observable<iProcessor[]>;
    psp: Observable<iProcessor>;

    msgPayment: msgPSPPayment;

    constructor(
        public httpClient: HttpClient,
        dataSvc: DataServiceService,

    ) {



    }

    public psp_paymentInstruction(psp: iProcessor, msgPayment: msgPSPPayment): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentInstruction';

        const body: any = {
            "uniqueRef": "",
            "payeeId": "user2@bank2",
            "payerAccountNo": "123456789012345678901234",
            "payerId": "user1@bank1",
            "payerPSP": "bank1",
            "payerName": "Bobby Dobby",
            "amount": "10",
            "userRef": "string",
            "consentKey": "'kjhagwfcabkjhfgbxewfjhgafbckskdf==",
            "originatingDate": "",
            "mpiHash": "034jh23kjhjhg345hkjg2345khg5432345=="
        }


        this.httpClient.post(apiEndpoint, body)
            .pipe(
                map(r => { console.log(r); }),
                catchError(err => of('error found'))
            )
            .subscribe()


        return;
    }

    public psp_paymentInstructionResponse(psp: iProcessor, msgPayment: msgPSPPayment): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentRequest';

        return;
    }

    public psp_paymentRequest(psp: iProcessor, msgPayment: msgPSPPayment): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/payementRequest';

        return;
    }

    public psp_paymentRequestResponse(psp: iProcessor, msgPayment: msgPSPPayment): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/payementRequest';

        return;
    }
}
