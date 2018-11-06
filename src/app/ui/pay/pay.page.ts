import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { sha256, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { formatNumber } from '@angular/common';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { PaymentInitiation, Processor, UserProfile, AccountDetail, ChannelCode } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { options } from '../../config';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
    processors: Observable<Processor[]>;
    accounts: AccountDetail[] = [];
    myPSP: Processor;
    myPsp: string;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: PaymentInitiation;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;

    apiUrl: string = options.pspApiUrl;

    useDefaultAccount = true;
    defaultAccount: AccountDetail;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;
    recipientZAP = false;
    recipientMobile = true;
    recipientEmail = true;
    recipient = 'zap';
    selectedContact: Contact;
    selectedNumber: string;

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private pspApiSvc: PspService,
        private router: Router,
        private contact: Contacts
    ) {
        this.user = this.auth.user;
        const ls = localStorage.getItem('myPSP');

        if (ls !== undefined && ls != null) {
            this.myPsp = ls;
        } else {
            console.log('PayPage: Can\'t read the PSP name from localstorage!!!!!');
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
                    // this.payerPspLable = '@' + this.userO.pspId;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => { this.myPSP = x; }
                        );


                    this.pay = {
                        userRef: null,
                        channel: ChannelCode.App,
                        clientKey: this.userO.clientKey,
                        payerName: this.userO.nickname,
                        payerAccountRef: null,
                        consentKey: null,
                        payeeId: this.userO.zapId,
                        amount: null,
                        originatingDate: '',
                        payeeMobileNo: '',
                        payeeEmail: ''
                    };

                    this.payForm = this.fb.group({
                        payerId: this.userO.zapId,
                        payerAccountRef: ['', [Validators.required]],
                        payerPSP: this.userO.pspId,
                        consentKey: null,
                        payeeId: [''],
                        payeeMobileNo: [''],
                        payeeEmail: [''],
                        payeePSP: [''],
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
                                    if (element.accountRef === this.userO.accountRef) {
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


    async selectContact() {
        this.selectedContact = await this.contact.pickContact();
        this.selectedContact.phoneNumbers.forEach(p => {
            if (p.pref) {
                this.payForm.patchValue({ payeeMobileNo: p.value });
                this.selectedNumber = p.value;
                this.notify.update('Selected Phone: ' + this.selectedNumber, 'info');
            }
        });
    }

    overideAccount() {
        this.useDefaultAccount = false;
    }

    async doPay(secret) {
        this.pay = this.payForm.value;
        this.pay.clientKey = this.userO.clientKey;

        if (this.pay.payeeId !== '') {
            this.pay.payeeId = this.pay.payeeId.trim().toUpperCase() + '@' + this.payForm.get('payeePSP').value;
        }

        this.pay.payeeMobileNo = this.pay.payeeMobileNo.trim().replace('+', '').replace(' ', '').replace('-', '');
        this.pay.payeeEmail = this.pay.payeeEmail.trim();
        this.pay.userRef = this.pay.userRef.trim();
        this.pay.consentKey = secret;
        this.pay.payerName = this.userO.nickname;

        this.pay.originatingDate = new Date().toISOString();
        let georgeDate = '';
        georgeDate = this.pay.originatingDate.replace('T', ' ').replace('Z', '000');
        this.pay.originatingDate = georgeDate;

        console.log(this.pay);

        if (this.pay.payeeId !== '' || this.pay.payeeMobileNo !== '' || this.pay.payeeEmail !== '') {
            this.pspApiSvc.psp_paymentInitiation(this.myPsp, this.pay)
                .subscribe(
                    x => {
                        if (x.responseStatus !== 'RJCT') {
                            this.notify.update('Payment to ' + this.pay.payeeId + ' submitted. Id: ' + x.endToEndId, 'info');
                        } else {
                            this.notify.update('Payment to ' + this.pay.payeeId + ' failed. Error: ' + x.responseDesc, 'error');
                        }


                    });
        } else {
            this.notify.update('A valid recipient data field must be supplied. \n Z@P Id, Mobile No or Email address', 'error');
        }




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


    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

}
