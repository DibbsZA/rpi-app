import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NotifyService } from '../../services/notify.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { formatNumber } from '@angular/common';
import { sha224, Message, sha256 } from 'js-sha256';
import { QrcodeService } from '../../services/qrcode.service';
import { AccountDetail, Processor, UserProfile, Transaction, PaymentInitiation } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { PspService } from '../../services/psp.service';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.page.html',
    styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

    processors: Observable<Processor[]>;
    accounts: AccountDetail[] = [];
    myPSP: Processor;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: PaymentInitiation;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;


    useDefaultAccount = true;
    defaultAccount: AccountDetail;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;
    scanComplete = false;
    myPsp: string;

    constructor(
        private barcodeScanner: BarcodeScanner,
        private auth: AuthService,
        private notify: NotifyService,
        private userSvc: UserService,
        private dataSvc: DataService,
        private fb: FormBuilder,
        // private txnSvc: TxnService,
        private pspApiSvc: PspService,
        private router: Router,
        private qrSvc: QrcodeService,
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

        this.payeePspLable = '@psp';
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

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => { this.myPSP = x; }
                        );


                    this.pay = {
                        userRef: null,
                        channel: '00',
                        clientKey: this.userO.clientKey,
                        payerName: this.userO.nickname,
                        payerAccountRef: null,
                        consentKey: null,
                        payeeId: null,
                        amount: null,
                        originatingDate: '',
                        payeeMobileNo: '',
                        payeeEmail: ''
                    };

                    this.payForm = this.fb.group({
                        payerId: this.userO.zapId.split('@').shift(),
                        payerAccountRef: ['', [Validators.required]],
                        payerPSP: this.userO.zapId.split('@').pop(),
                        consentKey: null,
                        payeeId: ['', [Validators.required]],
                        payeePSP: ['', [Validators.required]],
                        amountdisplay: [null],
                        amount: [null, [Validators.required, Validators.min(100), Validators.max(100000)]],
                        userRef: ['', [Validators.required]],
                    });

                    this.userSvc.getUserAccounts(this.userO.clientKey, this.myPsp)
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            tap(x => {
                                x.forEach(element => {
                                    this.accounts.push(element);
                                    if (element.default) {
                                        this.defaultAccount = element;
                                        this.payForm.patchValue({ payerAccountRef: element.accountRef });
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

    scan() {
        this.barcodeScanner.scan().then(barcodeData => {

            console.log('Barcode data', barcodeData);

            // this.notify.update('Barcode Data <br>' + JSON.stringify(barcodeData), 'note');

            if (barcodeData.cancelled) {
                return;
            }
            // hold existing this.pay values
            let _pay = this.pay;
            //Decode barcode data
            const decodedQr = this.qrSvc.decodeQR(barcodeData.text);
            this.pay.payeeId = decodedQr.payeeId;
            this.pay.payeeMobileNo = decodedQr.payeeMobileNo;
            this.pay.payeeEmail = decodedQr.payeeEmail;
            this.pay.amount = decodedQr.amount.toString();
            this.pay.userRef = decodedQr.userRef;

            console.log(this.pay);

            this.scanComplete = true;
            // this.notify.update('Barcode Data <br>' + JSON.stringify(this.pay), 'note');

            // Populate form with scanned data
            this.payForm.patchValue({
                payeePSP: this.pay.payeeId.split('@').pop(),
                payeeId: this.pay.payeeId.split('@').shift(),
                // payerId: this.pay.payerId,
                // payerPSP: this.pay.payerPSP,
                userRef: this.pay.userRef,
                amount: this.pay.amount
            })
            this.formatAmount(this.pay.amount);

        }).catch(err => {
            this.notify.update('Barcode Data <br>' + JSON.stringify(err), 'error');
            console.log('Error', err);
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
        this.pay.consentKey = secret;
        this.pay.payerName = this.userO.nickname;

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

        this.pay.originatingDate = new Date().toISOString();
        let georgeDate = '';
        georgeDate = this.pay.originatingDate.replace('T', ' ').replace('Z', '000');
        this.pay.originatingDate = georgeDate;

        // Deprecated
        // const txn: Transaction = {
        //     txnOwner: txnMsg.payerId,   // full ZAPID@PSP
        //     time: new Date().toISOString(),
        //     direction: 'outward',
        //     payMessage: txnMsg,
        //     payConfirm: {}
        // };

        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        console.log(this.pay);


        this.pspApiSvc.psp_paymentInitiation(this.myPSP, this.pay)
            .subscribe(
                x => {
                    if (x.responseStatus != "RJCT") {
                        this.notify.update('Payment to ' + this.pay.payeeId + ' submitted. Id: ' + x.endToEndId, 'info');
                    } else {
                        this.notify.update('Payment to ' + this.pay.payeeId + ' failed. Error: ' + x.responseDesc, 'error');
                    }


                });


    }

    eventCapture(event) {
        this.ShowPin = false;

        this.myPSP.apiUrl = event.pspUrl;
        this.Pin = event.pin;

        const m: Message = event.pin;
        const hashSecret = sha256.hmac(this.pay.clientKey, m);
        this.doPay(hashSecret);
        // .then(r => {
        // return this.router.navigate(['history']);
        // });
    }

    showPin() {
        this.ShowPin = !this.ShowPin;
    }

}
