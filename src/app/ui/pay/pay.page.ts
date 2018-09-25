import { Component, OnInit } from '@angular/core';
import { iUser, iProcessor, iTransaction } from '../../models/interfaces';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataServiceService } from '../../core/data-service.service';
import { msgPaymentInstruction, msgPSPPayment } from '../../models/messages';
import { sha256, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../core/notify.service';
import { TxnSvcService } from '../../core/txn-svc.service';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
    processors: Observable<iProcessor[]>;
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
        const txn: iTransaction = {
            txnOwner: this.userO.zapId + '@' + this.userO.pspId,
            time: new Date().getTime(),
            payMessage: txnMsg,
            payConfirm: {}
        };

        // TODO: Save Transaction to DB
        return this.txnSvc.savePayment(txn)
            .then(r => {
                this.notify.update('Payment to ' + this.pay.payeeId + '@' + this.pay.payeePSP + ' submitted.', 'info');
                console.log('Transaction saved!');
                console.log(r);
                return r;
            });
    }


    eventCapture(event) {
        this.ShowPin = false;
        this.Pin = event;
        const m: Message = event;
        const hashSecret = sha256.hmac(this.pay.payerPSP, m);
        console.log(hashSecret);
        this.doPay(hashSecret)
            .then(r => {
                return this.router.navigate(['history']);
            });
    }

    showPin() {
        this.ShowPin = !this.ShowPin;
    }
}
