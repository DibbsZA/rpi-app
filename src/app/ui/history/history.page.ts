import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AuthSvcService } from '../../core/auth-svc.service';
import { iUser, iTransaction } from '../../models/interfaces';
import { Observable } from 'rxjs';
import { TxnSvcService } from '../../core/txn-svc.service';
import { UserServiceService } from '../../core/user-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
    user: iUser;
    zapId: string;
    users: iUser[];
    history: iTransaction[];

    chart = [];


    constructor(
        public auth: AuthSvcService,
        public userSvc: UserServiceService,
        public txnSvc: TxnSvcService,
        private route: Router
    ) {
        this.auth.user
            .subscribe(u => {
                this.user = u;
                this.zapId = u.zapId + '@' + u.pspId;
            });

    }

    ngOnInit() {



        // this.history = this.txnSvc.getUserTxnHistory(this.zapId);
        this.txnSvc.getAllTxn().subscribe(
            x => {
                this.history = x;

                let amount = x.map(res => res.payMessage.amount / 100);


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

    viewDetail(txn) {
        this.route.navigate(['txn-detail/' + txn.id]);
    }
}
