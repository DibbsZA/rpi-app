import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { FormGroup } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction, Processor, UserProfile } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-pay-success',
    templateUrl: './pay-success.component.html',
    styleUrls: ['./pay-success.component.scss']
})
export class PaySuccessComponent implements OnInit {
    processors: Observable<Processor[]>;
    myPSP: Processor;
    user: Observable<firebase.User>;
    userO: UserProfile;
    pay: Transaction;
    payerPspLable: string;
    payeePspLable: string;
    payForm: FormGroup;

    myPsp: any;

    payAmount: string;
    Pin: String = '';
    ShowPin: Boolean = false;

    authorised: boolean = false;

    // FIXME: Mock data for testing
    fcmPayload: any = {
        endToEndId: '4c49eb1a5441_PSPNAME',
        payeeId: 'USER4@UBNK',
        payerName: 'User Three',
        payerId: 'USER3@STDB',
        userRef: 'REF',
        amount: '12300',
        originatingDate: '2018-09-30 16:04:49.649000'
    };
    constructor(
        private auth: AuthService,
        private userSvc: UserService,
        public notify: NotifyService,
        private router: Router,
        private activeRoute: ActivatedRoute,
        public dataSvc: DataService
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;

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
                    async x => {
                        this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);

                        if (this.userO.queryLimit !== undefined) {

                        } else {
                            this.notify.update('Please update your profile first!!!.', 'info');
                            this.router.navigate(['/profile']);
                        }

                        if (this.userO.pspId === null) {
                            this.notify.update('Please update your profile first!!!.', 'info');
                            this.router.navigate(['/profile']);

                        }

                    });
            });

    }

}
