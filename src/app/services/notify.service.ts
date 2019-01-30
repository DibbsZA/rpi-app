import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Transaction } from '../models/interfaces.0.3';

/// Notify users about errors and other helpful stuff
export interface Msg {
    content: string;
    style: string;
}


@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private _msgSource = new Subject<Msg | null>();

    msg = this._msgSource.asObservable();

    constructor(
        public toastController: ToastController,
        public alertController: AlertController,
        public router: Router
    ) {

    }

    update(content: any, style: 'note' | 'error' | 'info' | 'success' | 'paysuccess' | 'payfailed' | 'action') {

        const msg: Msg = { content, style };
        const msgContent: Transaction = content;
        const stringyfied = JSON.stringify(msgContent);
        const encoded = encodeURIComponent(stringyfied);

        if (content.toString().startsWith('{')) {
            msg.content = JSON.stringify(msg.content);
        }

        this._msgSource.next(msg);
        console.log(msg);
        if (msg.style === 'auth') {
            // this.router.navigate([msgContent.click_action.split('?').shift()], { queryParams: { msg: encoded } });
            this.router.navigate(['/payment/payauth'], { queryParams: { msg: encoded } });

        } else if (msg.style === 'error' || msg.style === 'note') {

            this.presentAlert(msg);
        } else if (msg.style === 'paysuccess') {

            msg.style = 'Success!';
            msg.content = '<ion-img src="/assets/icons/success-1.png" style="width: 50%;"></ion-img>';

            this.presentAlert(msg);
            this.router.navigateByUrl('/about');

        } else if (msg.style === 'payfailed') {

            msg.style = 'Oh no!';
            msg.content = '<ion-img src="/assets/icons/txnFailed1.jpg" style="width: 90%;"></ion-img>';

            this.presentAlert(msg);
            this.router.navigateByUrl('/about');

        } else {
            this.presentToast(msg.content);
        }
    }

    clear() {
        this._msgSource.next(null);
    }

    async presentAlert(msg: Msg) {
        const alert = await this.alertController.create({
            header: msg.style.toUpperCase(),
            message: msg.content,
            buttons: ['OK'],
            cssClass: 'appAlert'
        });
        await alert.present();
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top',
            cssClass: 'appToast'
        });
        toast.present();
    }
}
