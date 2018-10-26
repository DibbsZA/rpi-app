import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AuthSvcService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';
import { UserServiceService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { iUser, iTransaction } from '../../models/interfaces';
import { ActivatedRoute } from '@angular/router';
import { TxnSvcService } from '../../core/txn-svc.service';

@Component({
    selector: 'app-show-qr',
    templateUrl: './show-qr.page.html',
    styleUrls: ['./show-qr.page.scss'],
})
export class ShowQrPage implements OnInit {

    user: Observable<iUser>;
    id: string;
    txn: iTransaction;
    options: BarcodeScannerOptions;
    encodedData: {};

    constructor(
        private barcodeScanner: BarcodeScanner,
        private auth: AuthSvcService,
        private notify: NotifyService,
        private userSvc: UserServiceService,
        private route: ActivatedRoute,
        private txnSvc: TxnSvcService,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.txnSvc.getTxn(this.id)
            .subscribe(
                x => {
                    this.txn = x;
                    this.showQR();
                }
            );
    }

    showQR() {
        this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.txn.payMessage)
            .then(r => {
                this.notify.update(JSON.stringify(r), 'note');
                this.encodedData = r;
            }).catch(err => {
                this.notify.update('Encode failed <br>' + JSON.stringify(err), 'error');
                console.log('Error', err);
            });

    }

}
