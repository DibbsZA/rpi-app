import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from "rxjs/operators";

// import { PaymentRequestInitiation, PaymentRequestResponse, ChannelCode, PaymentInstructionResponse, PaymentInitiation, ApiResponse } from '../models/interfaces.0.2';
import { PaymentStatusMSG, CreditTransferMSG } from '../models/interfaces.0.3';

import { ErrorhandlerService } from './errorhandler.service';
import { Router } from '@angular/router';
import { DataService } from './data.service';



/**
 * Handle communicating with the PSP Payments RPI-API.
 *
 * @export
 * @class PspSvcService
 */
@Injectable({
    providedIn: 'root'
})
export class PspService {

    pspApiUrl: string;

    constructor(
        public router: Router,
        public httpClient: HttpClient,
        public errorHandler: ErrorhandlerService,
        public dataSvc: DataService
    ) {

        this.dataSvc.pspFinUrl
            .subscribe(uri => {
                this.pspApiUrl = uri;
            });

    }

    public psp_creditTransfer(msgCreditTransfer: CreditTransferMSG) {

        const apiEndpoint = this.pspApiUrl + '/creditTransfer';

        const body: CreditTransferMSG = {
            "originatingDate": msgCreditTransfer.originatingDate,
            "amount": msgCreditTransfer.amount.toString(),
            "payerAccount": msgCreditTransfer.payerAccount,
            "payeeAccount": msgCreditTransfer.payeeAccount,
            "userRef": msgCreditTransfer.userRef,
            "payerId": msgCreditTransfer.payerId,
            "payeeId": msgCreditTransfer.payeeId,
            "payerBankId": msgCreditTransfer.payerBankId,
            "payeeBankId": msgCreditTransfer.payeeBankId,
            "endToEndId": '',
            "currencyCode": msgCreditTransfer.currencyCode

        }

        return this.httpClient.post<any>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));

    }

    public psp_paymentStatus(msgPaymentStatus: PaymentStatusMSG) {

        const apiEndpoint = this.pspApiUrl + '/paymentStatus';
        const body: PaymentStatusMSG = {
            "endToEndId": msgPaymentStatus.endToEndId,
            "originatingDate": msgPaymentStatus.originatingDate,
            "clientKey": msgPaymentStatus.clientKey
        }

        return this.httpClient.post<any>(apiEndpoint, body)
            .pipe(catchError(this.errorHandler.handleError));
    }

}
