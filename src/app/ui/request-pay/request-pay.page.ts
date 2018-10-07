import { Component, OnInit } from '@angular/core';
import { iUser, iProcessor, iTransaction, iAccount } from '../../models/interfaces';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataServiceService } from '../../core/data-service.service';
import { msgPSPPayment } from '../../models/messages';
import { sha224 } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../core/notify.service';
import { TxnSvcService } from '../../core/txn-svc.service';
import { PspSvcService } from '../../core/psp-svc.service';
import { formatNumber } from '@angular/common';
import { UserServiceService } from '../../core/user-service.service';
import { tap } from 'rxjs/operators';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
    selector: 'app-request-pay',
    templateUrl: './request-pay.page.html',
    styleUrls: ['./request-pay.page.scss'],
})
export class RequestPayPage implements OnInit {
    processors: Observable<iProcessor[]>;
    accounts: iAccount[] = [];
    myPSP: iProcessor;
    user: Observable<iUser>;
    userO: iUser;
    pay: msgPSPPayment;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    useDefaultAccount = true;
    defaultAccount: iAccount;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;
    encodedData = {};

    constructor(
        private auth: AuthSvcService,
        private dataSvc: DataServiceService,
        private userSvc: UserServiceService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private txnSvc: TxnSvcService,
        private pspApiSvc: PspSvcService,
        private router: Router,
        private barcodeScanner: BarcodeScanner,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

        // this.payerPspLable = '@ select psp';
        this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            x => {
                if (x === null) {
                    return;
                }
                this.userO = x;
                if (this.userO.pspId == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    this.payeePspLable = '@' + this.userO.pspId;


                    this.userSvc.getUserAccounts(this.userO.uid)
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            tap(x => {
                                x.forEach(element => {
                                    this.accounts.push(element);
                                    if (element.default) {
                                        this.defaultAccount = element;
                                        this.payForm.patchValue({ payeeAccountNo: element.accountNo });
                                    }
                                });
                            })
                        )
                        .subscribe();

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => { this.myPSP = x; }
                        );


                    this.pay = {
                        uniqueRef: '',
                        userRef: null,
                        payeeId: this.userO.zapId,
                        payeeAccountNo: null,
                        payeeName: this.userO.nickname,
                        payeePSP: this.userO.pspId,
                        consentKey: null,
                        payerId: null,
                        payerPSP: null,
                        amount: null
                    };

                    this.payForm = this.fb.group({
                        payeeId: this.userO.zapId,
                        payeeAccountNo: ['', [Validators.required]],
                        payeePSP: this.userO.pspId,
                        consentKey: null,
                        payerId: ['', [Validators.required]],
                        payerPSP: ['', [Validators.required]],
                        amountdisplay: [null],
                        amount: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: ['', [Validators.required]]
                    });

                    this.payForm.valueChanges
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => {
                                this.pay = x;
                                console.log(x);
                                if (x.payerPSP != null) {

                                    this.payerPspLable = '@' + x.payerPSP;

                                }
                            });

                }

            });

    }

    formatAmount(val) {
        if (val != null) {
            if (val.length > 0) {
                // tslint:disable-next-line:prefer-const
                let amt_text: string = val;
                // tslint:disable-next-line:radix
                const amt_int = parseInt(amt_text.replace('.', '').replace(',', ''));
                this.payForm.patchValue({ amount: amt_int });
                const amt_dec = formatNumber(amt_int / 100, 'en', '1.2');
                this.payForm.patchValue({ amountdisplay: amt_dec });
            }
        }
    }


    overideAccount() {
        this.useDefaultAccount = false;
    }

    public whatError(name: string) {
        // name = 'payForm.' + name;
        const ctrl = this.payForm.get(name);
        const msg: string = 'Error in ' + name.toLocaleUpperCase() + ': </br>' + JSON.stringify(ctrl.errors) + ' ';
        this.notify.update(msg, 'error');
    }

    buildPayRequest() {
        this.pay = this.payForm.value;
        this.pay.payeeName = this.userO.nickname;

        // tslint:disable-next-line:prefer-const
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

        txnMsg.originatingDate = new Date().toISOString();
        let georgeDate = '';
        georgeDate = txnMsg.originatingDate.replace('T', ' ').replace('Z', '000');
        txnMsg.originatingDate = georgeDate;

        //  FIXME: Double check that payerId format & date format as this will affect the output!!!!!!!!!
        // Create mpiHash
        const hashInput = txnMsg.userRef + txnMsg.payeeId + txnMsg.payerId + txnMsg.amount.toString() + txnMsg.originatingDate;
        console.log(hashInput);

        txnMsg.mpiHash = sha224(hashInput);
        console.log(txnMsg.mpiHash);

        const txn: iTransaction = {
            txnOwner: txnMsg.payeeId,   // full ZAPID@PSP
            time: new Date().toISOString(),
            direction: 'inward',
            payMessage: txnMsg,
            payConfirm: {}
        };

        return txn;
    }

    public doPayRequest() {

        let txn = this.buildPayRequest();
        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        // console.log(this.myPSP);


        this.pspApiSvc.psp_paymentRequest(this.myPSP, txn.payMessage)
            .subscribe(
                x => {
                    // API Call succesfull
                    x.forEach(element => {
                        this.notify.update(element.uniqueRef, 'success');
                        // TODO: Do I set these on the http response or leave it to be updated at the END of the payment cycle?
                        txn.payConfirm.responseCode = element.responseCode;  // I assume if it worked this is a 200
                        txn.payConfirm.uniqueRef = element.uniqueRef;
                        txn.payConfirm.responseDesc = element.responseDesc;

                        // Save the transaction to the users history.
                        // TODO: use result to set status of Txn: pending, failed, or complete?
                        return this.txnSvc.savePayment(txn)
                            .then(r => {
                                this.notify.update('Payment to ' + this.pay.payeeId + ' submitted.', 'info');
                                console.log('Transaction saved!');
                                console.log(r);

                                return txn;
                            });

                    });
                },
                e => {
                    // API Call threw error
                    this.notify.update(e, 'error');
                    return txn;
                    // TODO: Do I need to save failed requests to the PSP API?

                }
            );

    }

    showQR() {
        const txn = this.buildPayRequest();
        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, txn.payMessage)
            .then(r => {
                this.notify.update(JSON.stringify(r), 'note');
                this.encodedData = r;
            }).catch(err => {
                this.notify.update('Encode failed <br>' + JSON.stringify(err), 'error');
                console.log('Error', err);
            });

    }


}
