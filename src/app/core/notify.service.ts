import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { ToastController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { msgPaymentAuth, msgPSPPayment } from '../models/messages';

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

    update(content: any, style: 'note' | 'error' | 'info' | 'success' | 'action') {

        const msg: Msg = { content, style };
        const msgContent: msgPSPPayment = content;
        const stringyfied = JSON.stringify(msgContent);
        const encoded = encodeURIComponent(stringyfied);

        if (content.toString().startsWith('{')) {
            msg.content = JSON.stringify(msg.content);
        }

        this._msgSource.next(msg);
        console.log(msg);
        if (msg.style === 'action') {
            this.router.navigate([msgContent.click_action.split('?').shift()], { queryParams: { msg: encoded } });

        } else if (msg.style === 'error' || msg.style === 'note') {

            this.presentAlert(msg);
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
