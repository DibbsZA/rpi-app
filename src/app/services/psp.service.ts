import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { options } from "../config";
import { map, catchError } from "rxjs/operators";

import { PaymentRequestInitiation, PaymentRequestResponse, ChannelCode, PaymentInstructionResponse, PaymentInitiation, ApiResponse, Transaction } from '../models/interfaces.0.2';
import { ErrorhandlerService } from './errorhandler.service';



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

    // msgPayment: Transaction;

    constructor(
        public httpClient: HttpClient,
        public errorHandler: ErrorhandlerService,
    ) {

    }

    public psp_paymentInitiation(pspId, msgPayment: PaymentInitiation) {

        const apiEndpoint = options.pspApiUrl + pspId + '/paymentInitiation';

        const body: PaymentInitiation = {
            "channel": ChannelCode.App,
            "originatingDate": msgPayment.originatingDate,
            "amount": msgPayment.amount.toString(),
            "clientKey": msgPayment.clientKey,
            "payerAccountRef": msgPayment.payerAccountRef,
            "payerName": msgPayment.payerName,
            "userRef": msgPayment.userRef,
            "consentKey": msgPayment.consentKey,
            "payeeId": msgPayment.payeeId,
            "payeeMobileNo": msgPayment.payeeMobileNo,
            "payeeEmail": msgPayment.payeeEmail
        }

        return this.httpClient.post<ApiResponse>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));

    }

    public psp_paymentInstructionResponse(pspId, msgPayment: PaymentInstructionResponse) {

        const apiEndpoint = options.pspApiUrl + pspId + '/paymentInstructionResponse';
        const body: PaymentInstructionResponse = {
            "endToEndId": msgPayment.endToEndId,
            "originatingDate": msgPayment.originatingDate,
            "payeeAccountRef": msgPayment.payeeAccountRef.toString(),
            "clientKey": msgPayment.clientKey,
            "responseStatus": msgPayment.responseStatus
        }

        return this.httpClient.post<ApiResponse>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));
    }

    public psp_paymentRequest(pspId, msgPayment: PaymentRequestInitiation) {

        const apiEndpoint = options.pspApiUrl + pspId + '/paymentRequestInitiation';

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

        return this.httpClient.post<ApiResponse>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));
    }

    public psp_paymentRequestResponse(pspId, msgPayment: PaymentRequestResponse) {

        const apiEndpoint = options.pspApiUrl + pspId + '/paymentRequestResponse';
        const body: PaymentRequestResponse = {
            "endToEndId": msgPayment.endToEndId,
            "originatingDate": msgPayment.originatingDate,
            "clientKey": msgPayment.clientKey,
            "payerAccountRef": msgPayment.payerAccountRef,
            "consentKey": msgPayment.consentKey,
            "responseStatus": msgPayment.responseStatus
        }

        return this.httpClient.post<ApiResponse>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));
    }


    public admin_TxnHistory(pspId, clientKey: string) {
        const apiEndpoint = options.pspApiUrl + pspId + '/txnHistory';

        return this.httpClient.get<Transaction[]>(apiEndpoint, { params: { clientKey: clientKey } });
    }
}
