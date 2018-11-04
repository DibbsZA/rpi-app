import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
    selector: 'app-txn-detail',
    templateUrl: './txn-detail.component.html',
    styleUrls: ['./txn-detail.component.scss']
})
export class TxnDetailComponent implements OnInit {

    txn: any = null;

    constructor(
        private navParams: NavParams,
    ) {

    }

    ngOnInit() {
        this.txn = JSON.parse(this.navParams.get('txn'));
    }

}
