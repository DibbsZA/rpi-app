import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthSvcService } from '../../core/auth-svc.service';
import { NotifyService } from '../../core/notify.service';
import { UserServiceService } from '../../core/user-service.service';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';

@Component({
    selector: 'app-scan',
    templateUrl: './scan.page.html',
    styleUrls: ['./scan.page.scss'],
})
export class ScanPage implements OnInit {

    user: Observable<iUser>;

    constructor(
        private barcodeScanner: BarcodeScanner,
        private auth: AuthSvcService,
        private notify: NotifyService,
        private userSvc: UserServiceService,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {

    }

    scan() {
        this.barcodeScanner.scan().then(barcodeData => {
            this.notify.update('Barcode Data <br>' + JSON.stringify(barcodeData), 'note');
            console.log('Barcode data', barcodeData);
        }).catch(err => {
            this.notify.update('Barcode Data <br>' + JSON.stringify(err), 'error');
            console.log('Error', err);
        });
    }


}
