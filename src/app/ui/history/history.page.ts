import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { DataService } from '../../services/data.service';
import { UserProfile, Transaction, Processor } from '../../models/interfaces.0.2';
import { ModalController } from '@ionic/angular';
import { TxnDetailComponent } from '../txn-detail/txn-detail.component';

@Component({
    selector: 'app-history',
    templateUrl: './history.page.html',
    styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
    user: Observable<firebase.User>;
    userO: UserProfile;
    zapId: string;
    users: UserProfile[];
    history: Transaction[];

    chart = [];
    processors: Observable<Processor[]>;
    myPSP: Processor;
    myPsp: string;


    constructor(
        public auth: AuthService,
        public userSvc: UserService,
        public pspSvc: PspService,
        public dataSvc: DataService,
        private router: Router,
        private notify: NotifyService,
        public modalController: ModalController

    ) {

        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls !== undefined && ls !== null) {
            this.myPsp = ls;
        } else {
            console.log("HistoryPage: Can't read the PSP name from localstorage!!!!!");
            return;
        }
    }

    ngOnInit() {

        this.processors = this.dataSvc.getProcessors();

        this.user.subscribe(
            async x => {
                console.log('profile: user -> x = ' + JSON.stringify(x));
                if (x !== null) {
                    this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                    if (this.userO.queryLimit === null) {
                        this.notify.update('Please update your profile first!!!.', 'info');
                        this.router.navigate(['/profile']);
                    }
                    this.userO.pspId = this.myPsp;

                    this.dataSvc.getProcessor(this.userO.pspId)
                        .subscribe(
                            // tslint:disable-next-line:no-shadowed-variable
                            x => {
                                this.myPSP = x;
                                this.showData();
                            }

                        );
                }

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
        this.pspSvc.admin_TxnHistory(this.myPsp, this.userO.clientKey).subscribe(
            x => {
                // if (x.responseStatus !== '') {
                //     return;
                // }

                this.history = x;
                const amount = x.map(res => res.amount / 100);


                // tslint:disable-next-line:prefer-const
                let txnDates = [];

                x.forEach(r => {
                    const jsdate = new Date(r.originatingDate);
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

        if (direction === 'R') {
            return false;
        } else {
            return true;
        }
    }

    viewDetail(txn) {
        this.presentModal(txn);
    }

    async presentModal(txn) {
        const modal = await this.modalController.create({
            component: TxnDetailComponent,
            componentProps: { txn: JSON.stringify(txn) }
        });

        await modal.present();

    }
}
