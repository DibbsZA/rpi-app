import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { formatNumber } from '@angular/common';
import { tap } from 'rxjs/operators';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { QrcodeService } from '../../services/qrcode.service';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { Transaction, Processor, UserProfile, AccountDetail, PaymentRequestInitiation, ChannelCode } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-request-pay',
    templateUrl: './request-pay.page.html',
    styleUrls: ['./request-pay.page.scss'],
})
export class RequestPayPage implements OnInit {
    processors: Observable<Processor[]>;
    accounts: AccountDetail[] = [];
    myPSP: Processor;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: PaymentRequestInitiation;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    useDefaultAccount = true;
    defaultAccount: AccountDetail;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;
    encodedData = {};
    myPsp: string;

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private pspApiSvc: PspService,
        private router: Router,
        private barcodeScanner: BarcodeScanner,
        private qrSvc: QrcodeService
    ) {
        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls != undefined && ls != null) {
            this.myPsp = ls;
        } else {
            console.log("AuthSvc: Can't read the PSP name from localstorage!!!!!");
            return;
        }
    }

    ngOnInit() {

        // this.payerPspLable = '@ select psp';
        this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            async x => {
                if (x === null) {
                    return;
                }
                this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                if (this.userO.queryLimit == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);

                } else {
                    this.userO.pspId = this.myPsp;
                    this.payeePspLable = '@' + this.userO.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => { this.myPSP = x; }
                        );

                    this.pay = {
                        channel: ChannelCode.App,
                        originatingDate: '',
                        clientKey: this.userO.clientKey,
                        userRef: null,
                        payeeAccountRef: null,
                        payeeName: this.userO.nickname,
                        payerId: null,
                        payerMobileNo: '',
                        payerEmail: '',
                        amount: null
                    };

                    this.payForm = this.fb.group({
                        payeeId: this.userO.zapId.split('@').shift(),
                        payeeAccountNo: ['', [Validators.required]],
                        payeePSP: this.userO.pspId,
                        consentKey: null,
                        payerId: ['', [Validators.required]],
                        payerPSP: ['', [Validators.required]],
                        amountdisplay: [null],
                        amount: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: ['', [Validators.required]]
                    });

                    this.userSvc.getUserAccounts(this.userO.clientKey, this.myPsp)
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            tap(x => {
                                x.forEach(element => {
                                    this.accounts.push(element);
                                    if (element.default) {
                                        this.defaultAccount = element;
                                        this.payForm.patchValue({ payeeAccountRef: element.accountRef });
                                    }
                                });
                            })
                        )
                        .subscribe();

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
            const amt_text: string = val;
            if (amt_text.length > 0) {
                // tslint:disable-next-line:radix
                const amt_int = parseInt(amt_text.replace('.', '').replace(',', ''));
                this.payForm.patchValue({ amount: amt_int });
                const amt_dec = formatNumber(amt_int / 100, 'en-GB', '1.2');
                this.payForm.patchValue({ amountdisplay: amt_dec });
            }
        }
    }


    overideAccount() {
        this.useDefaultAccount = false;
    }

    public whatError(formCtrlName: string) {
        // name = 'payForm.' + name;
        const ctrl = this.payForm.get(formCtrlName);
        const msg: string = 'Error in ' + formCtrlName.toLocaleUpperCase() + ': </br>' + JSON.stringify(ctrl.errors) + ' ';
        this.notify.update(msg, 'error');
    }

    buildPayRequest() {
        this.pay = this.payForm.value;

        // this.pay.payeeId = this.pay.payeeId.trim();
        this.pay.payerId = this.pay.payerId.trim();
        this.pay.userRef = this.pay.userRef.trim();

        this.pay.payeeName = this.userO.nickname;

        // tslint:disable-next-line:prefer-const
        let txnMsg: PaymentRequestInitiation = this.pay;

        if (this.myPSP === null) {
            console.log('no result for PSP lookup yet');
        }

        // TODO: This is not required on a clean form - but during testing am not cleaning the form on multiple submit
        // if (!txnMsg.payeeId.includes('@')) {
        //     txnMsg.payeeId = txnMsg.payeeId.toUpperCase() + '@' + txnMsg.payeePSP.toUpperCase();
        // }
        // if (!txnMsg.payerId.includes('@')) {
        //     txnMsg.payerId = txnMsg.payerId.toUpperCase() + '@' + txnMsg.payerPSP.toUpperCase();
        // }

        txnMsg.originatingDate = new Date().toISOString();
        let georgeDate = '';
        georgeDate = txnMsg.originatingDate.replace('T', ' ').replace('Z', '000');
        txnMsg.originatingDate = georgeDate;


        // deprecated
        // const txn: TransactionHistory = {
        //     txnOwner: txnMsg.payeeId,   // full ZAPID@PSP
        //     time: new Date().toISOString(),
        //     direction: 'inward',
        //     payMessage: txnMsg,
        //     payConfirm: {}
        // };

        return txnMsg;
    }

    public doPayRequest() {

        let txn = this.buildPayRequest();
        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        // console.log(this.myPSP);


        this.pspApiSvc.psp_paymentRequest(this.myPSP, txn)
            .subscribe(
                x => {
                    if (x.responseStatus != "RJCT") {
                        this.notify.update('Payment Requested from ' + this.pay.payerId + '. Id: ' + x.endToEndId, 'info');
                    } else {
                        this.notify.update('Payment Request from ' + this.pay.payerId + ' failed. Id: ' + x.endToEndId, 'error');
                    }


                });

    }

    showQR() {
        const txn = this.buildPayRequest();

        // serialise payment data
        const encoded = this.qrSvc.encodeQR(txn);

        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, encoded)
            .then(r => {
                this.notify.update(JSON.stringify(r), 'note');
                this.encodedData = r;
            }).catch(err => {
                this.notify.update('Encode failed <br>' + JSON.stringify(err), 'error');
                console.log('Error', err);
            });

    }


}
