import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { sha256, sha224, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { TxnSvcService } from '../../core/txn-svc.service';
import { formatNumber } from '@angular/common';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { PaymentInitiation, Processor, UserProfile, FirebaseUser } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
    processors: Observable<Processor[]>;
    accounts: Account[] = [];
    myPSP: Processor;
    user: Observable<FirebaseUser>;
    userO: UserProfile;
    pay: PaymentInitiation;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    useDefaultAccount = true;
    defaultAccount: Account;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private txnSvc: TxnSvcService,
        private pspApiSvc: PspService,
        private router: Router,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

        this.payeePspLable = '@psp';
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
                    this.payerPspLable = '@' + this.userO.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => { this.myPSP = x; }
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
                        amountdisplay: [null],
                        amount: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: ['', [Validators.required]],
                    });

                    this.userSvc.getUserAccounts(this.userO.uid)
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            tap(x => {
                                x.forEach(element => {
                                    this.accounts.push(element);
                                    if (element.default) {
                                        this.defaultAccount = element;
                                        this.payForm.patchValue({ payerAccountNo: element.accountNo });
                                    }
                                });
                            })
                        )
                        .subscribe();

                    this.payForm.valueChanges
                        // tslint:disable-next-line:no-shadowed-variable
                        .subscribe(x => {
                            console.log(x);


                            if (x.payeePSP != null) {

                                this.payeePspLable = '@' + x.payeePSP;

                            }
                        });

                }

            });

    }

    formatAmount(val) {
        if (val != null) {
            if (val.length > 0) {
                const amt_text: string = val;
                // tslint:disable-next-line:radix
                const amt_int = parseInt(amt_text.replace('.', '').replace(',', ''));
                this.payForm.patchValue({ amount: amt_int });
                const amt_dec = formatNumber(amt_int / 100, 'en-GB', '1.2');
                this.payForm.patchValue({ amountdisplay: amt_dec });
            }
        }
    }

    whatError(name: string) {
        // name = 'payForm.' + name;
        const ctrl = this.payForm.get(name);
        const msg: string = 'Error in ' + name.toLocaleUpperCase() + ': </br>' + JSON.stringify(ctrl.errors) + ' ';
        this.notify.update(msg, 'error');
    }

    overideAccount() {
        this.useDefaultAccount = false;
    }

    async doPay(secret) {
        this.pay = this.payForm.value;
        this.pay.payeeId = this.pay.payeeId.trim();
        this.pay.payerId = this.pay.payerId.trim();
        this.pay.userRef = this.pay.userRef.trim();
        this.pay.consentKey = secret;
        this.pay.payerName = this.userO.nickname;

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
            txnOwner: txnMsg.payerId,   // full ZAPID@PSP
            time: new Date().toISOString(),
            direction: 'outward',
            payMessage: txnMsg,
            payConfirm: {}
        };

        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        console.log(txnMsg);


        this.pspApiSvc.psp_paymentInstruction(this.myPSP, txnMsg)
            .subscribe(
                x => {
                    // API Call succesfull
                    x.forEach(element => {
                        // this.notify.update(element.uniqueRef, 'success');
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
                    // Do I need to save failed requests to the PSP API?

                }
            );

    }


    eventCapture(event) {
        this.ShowPin = false;

        this.myPSP.apiUrl = event.pspUrl;
        this.Pin = event.pin;

        const m: Message = event.pin;
        const hashSecret = sha256.hmac(this.pay.payerPSP, m);
        this.doPay(hashSecret);
        // .then(r => {
        // return this.router.navigate(['history']);
        // });
    }

    showPin() {
        this.ShowPin = !this.ShowPin;
    }


    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

}
