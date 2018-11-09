import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { sha256, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { formatNumber } from '@angular/common';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { UserProfile, Processor, AccountDetail, PaymentRequestResponse, Transaction, ResponseStatus } from '../../models/interfaces.0.2';
import { options } from '../../config';


@Component({
    selector: 'app-request-pay-auth',
    templateUrl: './request-pay-auth.page.html',
    styleUrls: ['./request-pay-auth.page.scss']
})
export class RequestPayAuthPage implements OnInit {
    processors: Observable<Processor[]>;
    accounts: AccountDetail[] = [];
    myPSP: Processor;
    myPsp: string;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: PaymentRequestResponse;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;

    apiUrl: string = options.pspApiUrl;

    useDefaultAccount = true;
    defaultAccount: AccountDetail;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;

    authorised = false;

    // FIXME: Mock data for testing
    fcmPayload: any = {
        endToEndId: '',
        payeeId: '',
        payeeName: '',
        userRef: '',
        amount: '',
        originatingDate: '',
        paymentType: ''
    };

    qrCodeData = '';

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private pspApiSvc: PspService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public alertController: AlertController,
    ) {
        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls !== undefined && ls !== null) {
            this.myPsp = ls;
        } else {
            console.log("RequestPayAuth: Can't read the PSP name from localstorage!!!!!");
            return;
        }
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
                this.notify.update(JSON.stringify(this.fcmPayload), 'note');
                // console.log(this.fcmPayload);
            }
        });

        this.payeePspLable = '@ ' + this.fcmPayload.payeeId.split('@').pop();
        // this.processors = this.dataSvc.getProcessors();


        this.user.subscribe(
            async x => {
                this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                if (this.userO.queryLimit === null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);

                } else {
                    this.userO.pspId = this.myPsp;
                    // this.payerPspLable = '@ ' + this.userO.pspId;

                    // this.dataSvc.getProcessor(this.userO.pspId)
                    //     .subscribe(
                    //         // tslint:disable-next-line:no-shadowed-variable
                    //         x => { this.myPSP = x; }
                    //     );

                    // let _payerId: string = this.fcmPayload.payerId;
                    let _payeeId: string = this.fcmPayload.payeeId;
                    // _payerId = _payerId.split('@').shift();
                    _payeeId = _payeeId.split('@').shift();

                    this.pay = {
                        endToEndId: this.fcmPayload.endToEndId,
                        clientKey: this.userO.clientKey,
                        consentKey: null,
                        payerAccountRef: null,
                        originatingDate: this.fcmPayload.originatingDate,
                        responseStatus: null
                    };

                    this.payForm = this.fb.group({
                        endToEndId: [this.fcmPayload.endToEndId, Validators.required],
                        payerId: [this.userO.zapId.split('@').shift()],
                        payerAccountRef: ['', [Validators.required]],
                        payerPSP: [this.userO.zapId.split('@').pop()],
                        payerName: [this.userO.nickname],
                        payeeName: [this.fcmPayload.payeeName],
                        payeeId: [_payeeId, [Validators.required]],
                        payeePSP: [this.fcmPayload.payeeId.split('@').pop()],
                        amount: [parseInt(this.fcmPayload.amount)],
                        userRef: [this.fcmPayload.userRef],
                        originatingDate: [this.fcmPayload.originatingDate]
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
                        });

                }

            });

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

    public doPay(secret) {
        this.pay = this.payForm.value;
        this.pay.clientKey = this.userO.clientKey;
        this.pay.consentKey = secret;
        this.pay.responseStatus = ResponseStatus.ACPT

        console.log(this.pay);

        this.pspApiSvc.psp_paymentRequestResponse(this.myPsp, this.pay)
            .subscribe(
                x => {
                    this.notify.update('Payment to ' + this.fcmPayload.payeeId + ' authorised.', 'info');
                    return this.router.navigateByUrl('/about');

                });

    }

    changeAuth() {
        this.authorised = !this.authorised;
    }

    async decline() {
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
                        return false;
                    }
                }, {
                    text: 'Don\'t Pay',
                    handler: () => {
                        console.log('Confirm decline');
                        this.pay.responseStatus = ResponseStatus.RJCT;
                        this.pspApiSvc.psp_paymentRequestResponse(this.myPsp, this.pay)
                            .subscribe(
                                x => {
                                    this.notify.update('Payment to ' + this.fcmPayload.payeeId + ' rejected.', 'info');
                                    return this.router.navigateByUrl('/about');
                                });
                    }
                }
            ]
        });

        await alert.present();
    }

    eventCapture(event) {
        this.ShowPin = false;

        // this.myPSP.apiUrl = event.pspUrl;
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
