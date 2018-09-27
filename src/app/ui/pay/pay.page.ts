import { Component, OnInit } from '@angular/core';
import { iUser, iProcessor, iTransaction } from '../../models/interfaces';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataServiceService } from '../../core/data-service.service';
import { msgPaymentInstruction, msgPSPPayment, msgConfirmation } from '../../models/messages';
import { sha256, sha224, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../core/notify.service';
import { TxnSvcService } from '../../core/txn-svc.service';
import { PspSvcService } from '../../core/psp-svc.service';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
    processors: Observable<iProcessor[]>;
    myPSP: iProcessor;
    user: Observable<iUser>;
    userO: iUser;
    pay: msgPaymentInstruction;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;

    constructor(
        private auth: AuthSvcService,
        private dataSvc: DataServiceService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private txnSvc: TxnSvcService,
        private pspApiSvc: PspSvcService,
        private router: Router
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

        this.payeePspLable = '@psp';
        this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            x => {
                this.userO = x;
                if (this.userO.pspId == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    this.payerPspLable = '@' + this.userO.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            x => { this.myPSP = x }
                        );

                    this.pay = {
                        userRef: null,
                        payerId: this.userO.zapId,
                        payerAccountNo: null,
                        payerPSP: this.userO.pspId,
                        consentKey: null,
                        payeeId: null,
                        payeePSP: null,
                        amount: null
                    };

                    this.payForm = this.fb.group({
                        payerId: this.userO.zapId,
                        payerAccountNo: ['', [Validators.required]],
                        payerPSP: this.userO.pspId,
                        consentKey: null,
                        payeeId: ['', [Validators.required]],
                        payeePSP: ['', [Validators.required]],
                        amount: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: ['', [Validators.required]],
                    });

                    this.payForm.valueChanges
                        .subscribe(x => {
                            console.log(x);
                            if (x.payeePSP != null) {

                                this.payeePspLable = '@' + x.payeePSP;

                            }
                        });

                }

            });

    }

    public whatError(name: string) {
        // name = 'payForm.' + name;
        const ctrl = this.payForm.get(name);
        const msg: string = "Error in " + name.toLocaleUpperCase() + ": </br>" + JSON.stringify(ctrl.errors) + " "
        this.notify.update(msg, 'error');
    }

    public doPay(secret) {
        this.pay = this.payForm.value;
        this.pay.consentKey = secret;

        const txnMsg: msgPSPPayment = this.pay;


        const payeeId = txnMsg.payeeId.toUpperCase() + '@' + txnMsg.payeePSP.toUpperCase();
        const payerId = txnMsg.payerId.toUpperCase() + '@' + txnMsg.payerPSP.toUpperCase();

        txnMsg.payeeId = payeeId;
        txnMsg.payerId = payerId;

        //  FIXME: Double check that payerId format & date format as this will affect the output!!!!!!!!!
        // Create mpiHash
        const hashInput = txnMsg.userRef + txnMsg.payeeId + txnMsg.payerId + txnMsg.amount.toString() + txnMsg.originatingDate;
        console.log(hashInput);

        txnMsg.mpiHash = sha224(hashInput);



        const txn: iTransaction = {
            txnOwner: payerId,   // full ZAPID@PSP
            time: new Date().getTime(),
            payMessage: txnMsg,
            payConfirm: {}
        };
        this.pspApiSvc.psp_paymentInstruction(this.myPSP, txnMsg)
            .subscribe(
                x => {
                    // API Call succesfull                    
                    this.notify.update(x, 'success');

                    // Handle Response? Should be of type msgConfirmation
                    // let result: msgConfirmation = x;

                    // TODO: Do I set these on the http response or leave it to be updated at the END of the payment cycle?
                    txn.payConfirm.responseCode = '200';  // I assume if it worked this is a 200
                    txn.payConfirm.uniqueRef = txn.payMessage.uniqueRef;
                    txn.payConfirm.responseDesc = 'placeholder';


                    // Save the transaction to the users history.
                    // TODO: use result to set status of Txn: pending, failed, or complete?
                    return this.txnSvc.savePayment(txn)
                        .then(r => {
                            this.notify.update('Payment to ' + this.pay.payeeId + '@' + this.pay.payeePSP + ' submitted.', 'info');
                            console.log('Transaction saved!');
                            console.log(r);

                            return txn;
                        });
                },
                e => {
                    // API Call threw error
                    this.notify.update(e, 'error');
                    return txn
                    // TODO: Do I need to save failed requests to the PSP API?

                }
            )

    }


    eventCapture(event) {
        this.ShowPin = false;
        this.Pin = event;
        const m: Message = event;
        const hashSecret = sha256.hmac(this.pay.payerPSP, m);
        console.log(hashSecret);
        this.doPay(hashSecret)
        // .then(r => {
        return this.router.navigate(['history']);
        // });
    }

    showPin() {
        this.ShowPin = !this.ShowPin;
    }
}
