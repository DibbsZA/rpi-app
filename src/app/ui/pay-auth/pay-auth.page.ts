import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { sha256, sha224, Message } from 'js-sha256';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { NotifyService } from '../../services/notify.service';
import { PspService } from '../../services/psp.service';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Processor, AccountDetail, UserProfile, PaymentInstructionResponse, Transaction, ResponseStatus } from '../../models/interfaces.0.2';
import { options } from '../../config';

@Component({
    selector: 'app-pay-auth',
    templateUrl: './pay-auth.page.html',
    styleUrls: ['./pay-auth.page.scss'],
})
export class PayAuthPage implements OnInit {
    processors: Observable<Processor[]>;
    accounts: AccountDetail[] = [];
    myPSP: Processor;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: PaymentInstructionResponse;
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
        payerName: '',
        payerId: '',
        endToEndId: '',
        originatingDate: '',
        amount: '',
        userRef: '',
        paymentType: ''
    };
    myPsp: string = null;

    constructor(
        private auth: AuthService,
        private dataSvc: DataService,
        private userSvc: UserService,
        private fb: FormBuilder,
        public notify: NotifyService,
        private pspApiSvc: PspService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public alertController: AlertController
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
            async x => {
                this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                this.userO.pspId = this.myPsp;
                if (this.userO.zapId == null || this.userO.zapId == '') {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    // this.payerPspLable = '@' + this.fcmPayload.pspId;

                    // this.dataSvc.getProcessor(this.userO.pspId)
                    //     .subscribe(
                    //         // tslint:disable-next-line:no-shadowed-variable
                    //         x => { this.myPSP = x; }
                    //     );

                    let _payerId: string = this.fcmPayload.payerId;
                    // let _payeeId: string = this.fcmPayload.payeeId;
                    _payerId = _payerId.split('@').shift();
                    let _payerPSP = _payerId.split('@').pop();
                    // _payeeId = _payeeId.split('@').shift();
                    // let _payeePSP = _payerId.split('@').pop();

                    this.pay = {
                        endToEndId: this.fcmPayload.endToEndId,
                        clientKey: this.userO.clientKey,
                        originatingDate: this.fcmPayload.originatingDate,
                        payeeAccountRef: null,
                        responseStatus: ResponseStatus.ACPT,
                    };

                    this.userSvc.getUserAccounts(this.userO.clientKey, this.myPsp)
                        .pipe(
                            // tslint:disable-next-line:no-shadowed-variable
                            tap(x => {
                                x.forEach(element => {
                                    this.accounts.push(element);
                                    if (element.accountRef == this.userO.accountRef) {
                                        this.defaultAccount = element;
                                        this.pay.payeeAccountRef = element.accountRef;
                                        this.doPay(null);
                                    }
                                });
                            })
                        )
                        .subscribe();

                    // this.payForm.valueChanges
                    //     // tslint:disable-next-line:no-shadowed-variable
                    //     .subscribe(x => {
                    //         console.log(x);
                    //     });

                }

            });

    }


    public whatError(name: string) {
        // name = 'payForm.' + name;
        const ctrl = this.payForm.get(name);
        const msg: string = 'Error in ' + name.toLocaleUpperCase() + ': <br />' + JSON.stringify(ctrl.errors) + ' ';
        this.notify.update(msg, 'error');
    }

    overideAccount() {
        this.useDefaultAccount = false;
    }

    public doPay(authorised) {
        // if (!authorised) {
        //     return;
        // }
        // this.pay = this.payForm.value;

        // if (this.myPSP === null) {
        //     console.log('no result for PSP lookup yet');
        // }

        this.pspApiSvc.psp_paymentInstructionResponse(this.myPSP, this.pay)
            .subscribe(
                x => {
                    if (x.responseStatus != "RJCT") {
                        this.notify.update('Payment from ' + this.fcmPayload.payerId + ' authorised. Id: ' + x.endToEndId, 'info');
                    } else {
                        this.notify.update('Payment Authorization from ' + this.fcmPayload.payerId + ' failed. Error: ' + x.responseDesc, 'error');
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
