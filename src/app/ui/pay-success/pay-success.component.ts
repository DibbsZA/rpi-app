import { Component, OnInit } from '@angular/core';
import { iUser, iProcessor, iTransaction } from '../../models/interfaces';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataServiceService } from '../../core/data-service.service';
import { msgPSPPayment, msgConfirmation } from '../../models/messages';
// import { sha256, sha224, Message } from 'js-sha256';

import { FormGroup } from '@angular/forms';
import { NotifyService } from '../../core/notify.service';
// import { TxnSvcService } from '../../core/txn-svc.service';
// import { PspSvcService } from '../../core/psp-svc.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pay-success',
    templateUrl: './pay-success.component.html',
    styleUrls: ['./pay-success.component.scss']
})
export class PaySuccessComponent implements OnInit {
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
        // private fb: FormBuilder,
        public notify: NotifyService,
        // private txnSvc: TxnSvcService,
        // private pspApiSvc: PspSvcService,
        private router: Router,
        private activeRoute: ActivatedRoute
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


        this.user.subscribe(
            x => {
                this.userO = x;
                if (this.userO.pspId == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);
                } else {
                    this.payerPspLable = '@' + this.fcmPayload.pspId;

                    // this.dataSvc.getProcessor(this.userO.pspId)
                    //     .subscribe(
                    //         x => { this.myPSP = x }
                    //     );

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
                        // payeeAccountNo: null,
                        amount: this.fcmPayload.amount,
                        originatingDate: this.fcmPayload.originatingDate,
                        responseCode: this.fcmPayload.responseCode,
                        responseDesc: this.fcmPayload.responseDesc,
                    };

                    // this.payForm = this.fb.group({
                    //     uniqueRef: [this.fcmPayload.uniqueRef, Validators.required],
                    //     payerId: [_payerId],
                    //     payeeAccountNo: ['', [Validators.required]],
                    //     payerPSP: [this.fcmPayload.payerPSP],
                    //     payerName: [this.fcmPayload.payerName],
                    //     payeeId: [_payeeId, [Validators.required]],
                    //     payeePSP: [this.fcmPayload.payeePSP, [Validators.required]],
                    //     amount: [this.fcmPayload.amount, [Validators.required, Validators.min(100), Validators.max(100000)]],
                    //     userRef: [this.fcmPayload.userRef, [Validators.required]],
                    //     originatingDate: [this.fcmPayload.originatingDate],
                    //     responseCode: ['APPROVED'],
                    //     responseDesc: ['Thanks!!']
                    // });

                    // this.payForm.valueChanges
                    //     .subscribe(x => {
                    //         console.log(x);
                    //         if (x.payeePSP != null) {

                    //             this.payeePspLable = '@' + x.payeePSP;

                    //         }
                    //     });

                }

            });

    }

}
