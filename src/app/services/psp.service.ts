import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
// import { map, catchError } from "rxjs/operators";

import { Transaction, Processor, PaymentRequestInitiation, PaymentRequestResponse, ChannelCode, PaymentInstructionResponse, PaymentInitiation } from '../models/interfaces.0.2';



/**
 * Handle communicating with the PSP Payments API.
 *
 * @export
 * @class PspSvcService
 */
@Injectable({
    providedIn: 'root'
})
export class PspService {

    msgPayment: Transaction;

    constructor(
        public httpClient: HttpClient
    ) {

    }

    public psp_paymentInitiation(psp: Processor, msgPayment: Transaction): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentInitiation';

        const body: PaymentInitiation = {
            "channel": ChannelCode.App,
            "originatingDate": msgPayment.originatingDate,
            "amount": msgPayment.amount.toString(),
            "clientKey": msgPayment.clientKey,
            "payerAccountRef": msgPayment.payerAccountRef.toString(),
            "payerName": msgPayment.payerName,
            "userRef": msgPayment.userRef,
            "consentKey": msgPayment.consentKey,
            "payeeId": msgPayment.payeeId,
            "payeeMobileNo": msgPayment.payeeMobileNo,
            "payeeEmail": msgPayment.payeeEmail
        }

        return this.httpClient.post(apiEndpoint, body);

    }

    public psp_paymentInstructionResponse(psp: Processor, msgPayment: Transaction): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentAuth';
        const body: PaymentInstructionResponse = {
            "endToEndId": msgPayment.endToEndId,
            "originatingDate": msgPayment.originatingDate,
            "payeeAccountRef": msgPayment.payeeAccountRef.toString(),
            "clientKey": msgPayment.clientKey,
            "responseStatus": msgPayment.responseStatus
        }

        return this.httpClient.post(apiEndpoint, body)
    }

    public psp_paymentRequest(psp: Processor, msgPayment: Transaction): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentRequest';

        const body: PaymentRequestInitiation = {
            "originatingDate": msgPayment.originatingDate,
            "clientKey": msgPayment.clientKey,
            "channel": ChannelCode.App,                    // TODO: PSP should control list of ChannelCodes 
            "payeeName": msgPayment.payeeName,
            "payeeAccountRef": msgPayment.payeeAccountRef,
            "payerId": msgPayment.payerId,
            "payerMobileNo": msgPayment.payerMobileNo,
            "payerEmail": msgPayment.payerEmail,
            "amount": msgPayment.amount.toString(),
            "userRef": msgPayment.userRef,
        }

        return this.httpClient.post(apiEndpoint, body)
    }

    public psp_paymentRequestResponse(psp: Processor, msgPayment: Transaction): Observable<any> {

        const apiEndpoint = psp.apiUrl + '/paymentRequestResponse';
        const body: PaymentRequestResponse = {
            "endToEndId": msgPayment.endToEndId,
            "originatingDate": msgPayment.originatingDate,
            "clientKey": msgPayment.clientKey,
            "payerAccountRef": msgPayment.payerAccountRef,
            "consentKey": msgPayment.consentKey,
            "responseStatus": msgPayment.responseStatus
        }

        return this.httpClient.post(apiEndpoint, body)
    }
}
