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
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { formatNumber } from '@angular/common';

@Component({
    selector: 'app-request-pay-auth',
    templateUrl: './request-pay-auth.page.html',
    styleUrls: ['./request-pay-auth.page.scss']
})
export class RequestPayAuthPage implements OnInit {
    processors: Observable<iProcessor[]>;
    myPSP: iProcessor;
    user: Observable<iUser>;
    userO: iUser;
    pay: msgPSPPayment;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;

    authorised: boolean = false;

    // FIXME: Mock data for testing
    fcmPayload: any = {
        uniqueRef: '4c49eb1a5441',
        payeeId: 'USER4@UBNK',
        payeePSP: 'UBNK',
        payeeAccountNo: '',
        payerAccountNo: '',
        payerName: 'User Three',
        payerId: 'USER3@STDB',
        payerPSP: 'STDB',
        userRef: 'REF',
        amount: '12300',
        mpiHash: '4a18aefba736a9b4bf66435e1e51162df68d6a8bc13749031e4d7ad4',
        originatingDate: '2018-09-30 16:04:49.649000'
    };

    constructor(
        private auth: AuthSvcService,
        private dataSvc: DataServiceService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private txnSvc: TxnSvcService,
        private pspApiSvc: PspSvcService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public alertController: AlertController
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

        this.activeRoute.queryParams.subscribe(queryParams => {
            if (queryParams.msg !== undefined) {
                let msg: string = queryParams.msg;
                if (msg.startsWith('%')) {
                    msg = decodeURIComponent(msg);
                    this.fcmPayload = JSON.parse(msg);
                } else {

                    this.fcmPayload = JSON.parse(queryParams.msg);
                }
                console.log(this.fcmPayload);
            }
        });

        this.payeePspLable = '@ ' + this.fcmPayload.payeePSP;
        this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            x => {
                this.userO = x;
                if (this.userO.pspId == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    this.payerPspLable = '@ ' + this.userO.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            x => { this.myPSP = x }
                        );

                    // let _payerId: string = this.fcmPayload.payerId;
                    let _payeeId: string = this.fcmPayload.payeeId;
                    // _payerId = _payerId.split('@').shift();
                    _payeeId = _payeeId.split('@').shift();

                    this.pay = {
                        uniqueRef: this.fcmPayload.uniqueRef,
                        userRef: this.fcmPayload.userRef,
                        payerId: this.userO.zapId,
                        payerName: this.userO.nickname,
                        payerPSP: this.userO.pspId,
                        payeeId: _payeeId,
                        payeeName: this.fcmPayload.payeeName,
                        payeePSP: this.fcmPayload.payeePSP,
                        payerAccountNo: null,
                        consentKey: null,
                        mpiHash: null,
                        amount: this.fcmPayload.amount,
                        originatingDate: this.fcmPayload.originatingDate,
                        responseCode: '',
                        responseDesc: '',
                    };

                    this.payForm = this.fb.group({
                        uniqueRef: [this.fcmPayload.uniqueRef, Validators.required],
                        payerId: [this.pay.payerId],
                        payerAccountNo: ['', [Validators.required]],
                        payerPSP: [this.pay.payerPSP],
                        payerName: [this.pay.payerName],
                        payeeName: [this.fcmPayload.payeeName],
                        payeeId: [_payeeId, [Validators.required]],
                        payeePSP: [this.fcmPayload.payeePSP, [Validators.required]],
                        amount: [this.fcmPayload.amount, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: [this.fcmPayload.userRef, [Validators.required]],
                        originatingDate: [this.fcmPayload.originatingDate],
                        responseCode: ['APPROVED'],
                        responseDesc: ['Thanks!!']
                    });

                    this.payForm.valueChanges
                        .subscribe(x => {
                            console.log(x);
                            // if (x.payeePSP != null) {
                            //     this.payeePspLable = '@' + x.payeePSP;
                            // }
                        });

                }

            });

    }


    formatAmount(val) {
        if (val != null) {
            if (val.length > 0) {
                let amt_text: string = val;
                let amt_int = parseInt(amt_text.replace('.', '').replace(',', ''));
                this.payForm.patchValue({ amount: amt_int });
                let amt_dec = formatNumber(amt_int / 100, 'en', '1.2');
                this.payForm.patchValue({ amountdisplay: amt_dec });
            }
        }
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
        this.pay.payerName = this.userO.nickname;

        let txnMsg: msgPSPPayment = this.pay;

        if (this.myPSP === null) {
            console.log('no result for PSP lookup yet');
        }

        // TODO: This is not required on a clean form - but during testing am not cleaning the form on multiple submit
        if (!txnMsg.payeeId.includes('@')) {
            txnMsg.payeeId = txnMsg.payeeId.toUpperCase() + '@' + txnMsg.payeePSP.toUpperCase();
        }
        if (!txnMsg.payerId.includes('@')) {
            txnMsg.payerId = txnMsg.payerId.toUpperCase() + '@' + txnMsg.payerPSP.toUpperCase();
        }

        // txnMsg.originatingDate = new Date().toISOString();
        // let georgeDate: string = "";
        // georgeDate = txnMsg.originatingDate.replace('T', ' ').replace('Z', '000');
        // txnMsg.originatingDate = georgeDate;

        //  FIXME: Double check that payerId format & date format as this will affect the output!!!!!!!!!
        // Create mpiHash
        const hashInput = txnMsg.userRef + txnMsg.payeeId + txnMsg.payerId + txnMsg.amount.toString() + txnMsg.originatingDate;
        console.log(hashInput);


        let confirmHash = sha224(hashInput);
        if (confirmHash !== this.fcmPayload.mpiHash) {
            this.notify.update("'Hashes don't Match!!", "error");
        }
        console.log(txnMsg.mpiHash);
        this.pay.mpiHash = this.fcmPayload.mpiHash;

        const txn: iTransaction = {
            txnOwner: txnMsg.payerId,   // full ZAPID@PSP
            time: new Date().toISOString(),
            direction: 'outward',
            payMessage: txnMsg,
            payConfirm: {}
        };

        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        console.log(txn);


        this.pspApiSvc.psp_paymentRequestResponse(this.myPSP, txnMsg)
            .subscribe(
                x => {
                    // API Call succesfull                    
                    this.notify.update(x, 'success');

                    // Handle Response? Should be of type msgConfirmation
                    // let result: msgConfirmation = x;

                    // TODO: Do I set these on the http response or leave it to be updated at the END of the payment cycle?
                    txn.payConfirm.responseCode = 'APPROVED';  // I assume if it worked this is a 200
                    txn.payConfirm.uniqueRef = txn.payMessage.uniqueRef;
                    txn.payConfirm.responseDesc = 'Take the cash.';


                    // Save the transaction to the users history.
                    // TODO: use result to set status of Txn: pending, failed, or complete?
                    return this.txnSvc.savePayment(txn)
                        .then(r => {
                            this.notify.update('Payment to ' + this.pay.payeeId + ' submitted.', 'info');
                            console.log('Transaction saved!');
                            console.log(r);

                            return this.router.navigateByUrl('/history');
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

    changeAuth() {
        this.authorised = !this.authorised;
    }

    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Don\'t send the payment?</strong>!!!',
            buttons: [
                {
                    text: 'Reconsider',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Don\'t Pay',
                    handler: () => {
                        console.log('Confirm decline');
                    }
                }
            ]
        });

        await alert.present();
    }

    eventCapture(event) {
        this.ShowPin = false;

        this.myPSP.apiUrl = event.pspUrl;
        this.Pin = event.pin;

        const m: Message = event.pin;
        const hashSecret = sha256.hmac(this.pay.payerPSP, m);
        this.doPay(hashSecret)
        // .then(r => {
        // return this.router.navigate(['history']);
        // });
    }

    showPin() {
        this.ShowPin = !this.ShowPin;
    }

}
