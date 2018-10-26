import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthSvcService } from '../../services/auth.service';
import { iUser, iTransaction } from '../../models/interfaces';
import { Observable } from 'rxjs';
import { TxnSvcService } from '../../core/txn-svc.service';
import { UserServiceService } from '../../services/user.service';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
    user: Observable<iUser>;
    userO: iUser;
    zapId: string;
    users: iUser[];
    history: iTransaction[];

    chart = [];


    constructor(
        public auth: AuthSvcService,
        public userSvc: UserServiceService,
        public txnSvc: TxnSvcService,
        private router: Router,
        private notify: NotifyService,

    ) {

        this.user = this.auth.user;
    }

    ngOnInit() {


        this.user.subscribe(
            x => {
                if (x !== null) {
                    this.userO = x;
                    if (this.userO.pspId == null) {
                        this.notify.update('Please update your profile first!!!.', 'info');
                        this.router.navigate(['/profile']);
                    }
                    this.zapId = this.userO.zapId + '@' + this.userO.pspId;
                    this.showData();
                }

            },
            e => {

            }
        );


    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    showData() {
        // this.history = this.txnSvc.getUserTxnHistory(this.zapId);
        this.txnSvc.getUserTxnHistory(this.zapId).subscribe(
            x => {
                this.history = x;

                const amount = x.map(res => res.payMessage.amount / 100);


                // tslint:disable-next-line:prefer-const
                let txnDates = [];

                x.forEach(r => {
                    const jsdate = new Date(r.time);
                    // txnDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
                    txnDates.push(jsdate.toLocaleDateString());
                });

                this.chart = new Chart('canvas', {
                    type: 'bar',
                    data: {
                        labels: txnDates,
                        datasets: [
                            {
                                label: 'Payments',
                                data: amount,
                                backgroundColor: '#f9a61a'
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Recent Activity'
                        },
                        scales: {
                            xAxes: [{
                                display: true
                            }],
                            yAxes: [{
                                display: true,

                            }]
                        }
                    }

                });

            }
        );
    }

    isInward(direction): boolean {

        if (direction === 'inward') {
            return true;
        } else {
            return false;
        }
    }

    viewDetail(txn) {
        this.router.navigate(['txn-detail/' + txn.id]);
    }
}
