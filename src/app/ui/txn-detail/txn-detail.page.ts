import { Component, OnInit } from '@angular/core';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ActivatedRoute, Router } from '@angular/router';
import { TxnSvcService } from '../../core/txn-svc.service';
import { iTransaction } from '../../models/interfaces';
import { Observable } from 'rxjs';


@Component({
    selector: 'app-txn-detail',
    templateUrl: './txn-detail.page.html',
    styleUrls: ['./txn-detail.page.scss'],
})
export class TxnDetailPage implements OnInit {
    id: any;
    txn: iTransaction = {
        txnOwner: null,
        payMessage: null,
        payConfirm: null,
        direction: null,
        time: null
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private txnSvc: TxnSvcService,
    ) {

    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.txnSvc.getTxn(this.id)
            .subscribe(
                x => this.txn = x
            );
    }

    genQR(txn) {
        this.router.navigate(['show-qr/' + txn.id]);
    }
}
