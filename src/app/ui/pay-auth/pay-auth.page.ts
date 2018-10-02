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

@Component({
    selector: 'app-pay-auth',
    templateUrl: './pay-auth.page.html',
    styleUrls: ['./pay-auth.page.scss'],
})
export class PayAuthPage implements OnInit {
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

        this.payeePspLable = '@psp';

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

        this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            x => {
                this.userO = x;
                if (this.userO.pspId == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    this.payerPspLable = '@' + this.fcmPayload.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            x => { this.myPSP = x }
                        );

                    let _payerId: string = this.fcmPayload.payerId;
                    let _payeeId: string = this.fcmPayload.payeeId;
                    _payerId = _payerId.split('@').shift();
                    _payeeId = _payeeId.split('@').shift();

                    this.pay = {
                        uniqueRef: this.fcmPayload.uniqueRef,
                        userRef: this.fcmPayload.userRef,
                        payerId: _payerId,
                        payerName: this.fcmPayload.payerName,
                        payerPSP: this.fcmPayload.pspId,
                        payeeId: _payeeId,
                        payeePSP: this.fcmPayload.payeePSP,
                        payeeAccountNo: null,
                        amount: this.fcmPayload.amount,
                        originatingDate: this.fcmPayload.originatingDate,
                        responseCode: '',
                        responseDesc: '',
                    };

                    this.payForm = this.fb.group({
                        uniqueRef: [this.fcmPayload.uniqueRef, Validators.required],
                        payerId: [_payerId],
                        payeeAccountNo: ['', [Validators.required]],
                        payerPSP: [this.fcmPayload.payerPSP],
                        payerName: [this.fcmPayload.payerName],
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

    public doPay(authorised) {
        if (!authorised) {
            return;
        }
        this.pay = this.payForm.value;
        this.pay.mpiHash = this.fcmPayload.mpiHash;

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
        let hashCheck = sha224(hashInput).toString();
        if (hashCheck !== this.fcmPayload.mpiHash) {
            this.notify.update('Form input fields don\'t match!', 'error');
            return;
        }

        // txnMsg.mpiHash = sha224(hashInput);
        // console.log(txnMsg.mpiHash);

        const txn: iTransaction = {
            txnOwner: txnMsg.payeeId,   // full ZAPID@PSP
            direction: 'inward',
            time: new Date().toISOString(),
            payMessage: txnMsg,
            payConfirm: {}
        };

        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        // console.log(this.myPSP);


        this.pspApiSvc.psp_paymentInstructionResponse(this.myPSP, txnMsg)
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
                            this.notify.update('Payment to ' + this.pay.payeeId + ' authorized.', 'info');
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

    changeAuth() {
        this.authorised = !this.authorised;
    }

    async presentAlertConfirm() {
        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: '<strong>Don\'t you want to get the payment?</strong>',
            buttons: [
                {
                    text: 'Reconsider',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Decline',
                    handler: () => {
                        console.log('Confirm decline');
                    }
                }
            ]
        });

        await alert.present();
    }
}
