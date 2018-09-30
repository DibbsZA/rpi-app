import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataServiceService } from './data-service.service';
import { AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { iProcessor } from '../models/interfaces';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { msgPSPPayment } from '../models/messages';



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

    headers: HttpHeaders = new HttpHeaders();

    constructor(
        public httpClient: HttpClient,
        dataSvc: DataServiceService,

    ) {


        this.headers = this.headers.append('Access-Control-Allow-Origin', '*');
        // this.headers = this.headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        // this.headers = this.headers.append('Content-Type', 'application/json');
        // this.headers = this.headers.append('Accept', 'application/json');

    }

    public psp_paymentInstruction(psp: iProcessor, msgPayment: msgPSPPayment): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentInstruction';



        const body: any = {
            "uniqueRef": '',
            "payeeId": msgPayment.payeeId,
            "payerAccountNo": msgPayment.payerAccountNo,
            "payerId": msgPayment.payerId,
            "payerPSP": msgPayment.payerPSP,
            "payerName": msgPayment.payerName,
            "amount": msgPayment.amount.toString(),
            "userRef": msgPayment.userRef,
            "consentKey": msgPayment.consentKey,
            "originatingDate": msgPayment.originatingDate,
            "mpiHash": msgPayment.mpiHash
        }


        let h = this.httpClient.post(apiEndpoint, body)
            // .pipe(
            //     map(r => { 
            //         console.log(r); 
            //     }),
            //     catchError(err => of('error found'))
            // )
            .subscribe(
                x => {
                    console.log(x);
                    return x;
                }
            )


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
