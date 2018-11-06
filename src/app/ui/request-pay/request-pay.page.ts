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
import { Processor, UserProfile, AccountDetail, PaymentRequestInitiation, ChannelCode } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { options } from "../../config";

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

    apiUrl: string = options.pspApiUrl;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;
    encodedData = {};
    myPsp: string;
    recipientZAP: boolean = false;
    recipientMobile: boolean = true;
    recipientEmail: boolean = true;
    recipient: string = 'zap';
    // selectedContact: Contact;
    // firstNumber: string;
    // selectedContactNumbers: IContactField[];

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private pspApiSvc: PspService,
        private router: Router,
        private barcodeScanner: BarcodeScanner,
        private qrSvc: QrcodeService,
        // private contact: Contacts
    ) {
        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls !== undefined && ls !== null) {
            this.myPsp = ls;
        } else {
            console.log("Req2PayPage: Can't read the PSP name from localstorage!!!!!");
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
                if (this.userO.queryLimit === null) {
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
                        payeeName: this.userO.nickname,
                        userRef: null,
                        payeeAccountRef: null,
                        payerId: null,
                        payerMobileNo: '',
                        payerEmail: '',
                        amount: null
                    };

                    this.payForm = this.fb.group({
                        payeeId: this.userO.zapId.split('@').shift(),
                        payeeAccountRef: ['', [Validators.required]],
                        payeePSP: this.userO.pspId,
                        consentKey: null,
                        payerId: [''],
                        payerMobileNo: [''],
                        payerEmail: [''],
                        payerPSP: [''],
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
                                    if (element.accountRef === this.userO.accountRef) {
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
                                if (x.payerPSP !== null) {

                                    this.payerPspLable = '@' + x.payerPSP;

                                }
                            });

                }

            });

    }

    formatAmount(val) {
        if (val !== null) {
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


    segmentChanged(ev: any) {
        console.log('Segment changed', ev);

        this.recipient = ev.detail.value;
        switch (ev.detail.value) {
            case 'zap':

                this.recipientZAP = false;
                this.recipientMobile = true;
                this.recipientEmail = true;
                break;

            case 'mobile':

                this.recipientMobile = false;
                this.recipientZAP = true;
                this.recipientEmail = true;
                break;

            case 'email':

                this.recipientEmail = false;
                this.recipientZAP = true;
                this.recipientMobile = true;
                break;

            default:
                this.recipientZAP = false;
                this.recipientMobile = true;
                this.recipientEmail = true;
                break;
        }
    }


    // async selectContact() {
    //     this.selectedContact = await this.contact.pickContact();
    //     this.selectedContactNumbers = this.selectedContact.phoneNumbers;
    //     this.firstNumber = this.selectedContact.phoneNumbers.shift().value;
    //     this.payForm.patchValue({ payerMobileNo: this.firstNumber });
    //     this.notify.update('Selected Phonenumbers: \n' + JSON.stringify(this.selectedContactNumbers), 'note');
    // }

    buildPayRequest() {
        this.pay = this.payForm.value;

        this.pay.clientKey = this.userO.clientKey;

        if (this.pay.payerId !== '') {
            this.pay.payerId = this.pay.payerId.split('@').shift().trim().toUpperCase() + '@' + this.payForm.get('payerPSP').value;
        }

        this.pay.payerMobileNo = this.pay.payerMobileNo.trim();
        this.pay.payerEmail = this.pay.payerEmail.trim();

        this.pay.userRef = this.pay.userRef.trim();
        this.pay.payeeName = this.userO.nickname;

        this.pay.originatingDate = new Date().toISOString();
        let georgeDate = '';
        georgeDate = this.pay.originatingDate.replace('T', ' ').replace('Z', '000');
        this.pay.originatingDate = georgeDate;

        // tslint:disable-next-line:prefer-const
        let txnMsg: PaymentRequestInitiation = this.pay;
        return txnMsg;
    }

    public doPayRequest() {

        let txn = this.buildPayRequest();
        // this.myPSP = await this.dataSvc.getProcessor(txnMsg.payerPSP);
        // console.log(this.myPSP);

        if (txn.payerId !== '' || txn.payerMobileNo !== '' || txn.payerEmail !== '') {

            this.pspApiSvc.psp_paymentRequest(this.myPsp, txn)
                .subscribe(
                    x => {
                        this.notify.update('Payment Requested from ' + this.pay.payerId + '.', 'info');
                        // if (x.responseStatus !== "RJCT") {
                        //     this.notify.update('Payment Requested from ' + this.pay.payerId + '. Id: ' + x.endToEndId, 'info');
                        // } else {
                        //     this.notify.update('Payment Request from ' + this.pay.payerId + ' failed. Id: ' + x.endToEndId, 'error');
                        // }


                    });
        } else {
            this.notify.update('A valid requestor data field must be supplied. \n Z@P Id, Mobile No or Email address', 'error');

        }



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
