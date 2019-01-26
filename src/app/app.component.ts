import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FcmService } from './services/fcm.service';
import { NotifyService } from './services/notify.service';
import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Transaction } from './models/interfaces.0.2';
import { options } from './config';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    loggedin = false;
    private messageSource = new Subject();
    currentMessage = this.messageSource.asObservable();

    public appPages = [
        { title: 'Login', url: '/home', icon: 'log-in', loggedin: false },
        { title: 'Pay', url: '/payment/pay', icon: 'cash', icon2: 'arrow-round-forward', loggedin: true },
        { title: 'Request Payment', url: '/payment/requestpay', icon: 'cash', icon2: 'arrow-round-back', loggedin: true },
        { title: 'Scan', url: '/payment/scan', icon: 'qr-scanner', loggedin: true },
        { title: 'Profile', url: '/profile', icon: 'contact', loggedin: true },
        { title: 'About', url: '/about', icon: 'information-circle-outline' }
    ];
    appVersion: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private menu: MenuController,
        public fcm: FcmService,
        public notify: NotifyService,
        public auth: AuthService,
        public router: Router,
    ) {

    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.appVersion = options.version;
            this.splashScreen.hide();
            this.auth.user
                .subscribe(user => {
                    this.loggedin = true;

                    if (user) {
                        this.fcm.getToken(user);

                        this.fcm.monitorTokenRefresh(user).subscribe();

                        this.fcm.listenToNotifications()
                            .pipe(
                                tap(msg => {
                                    if (msg === null) {
                                        return;
                                    }
                                    console.log('Message received. ');
                                    console.log(msg);
                                    // if (!msg.tap) {
                                    const data: Transaction = msg;
                                    if (data.paymentType === 'PI') {
                                        const stringyfied = JSON.stringify(data);
                                        const encoded = encodeURIComponent(stringyfied);
                                        this.router.navigate(['/payment/payauth'], { queryParams: { msg: encoded } });
                                    } else if (data.paymentType === 'PR') {
                                        const stringyfied = JSON.stringify(data);
                                        const encoded = encodeURIComponent(stringyfied);
                                        this.router.navigate(['/payment/requestpayauth'], { queryParams: { msg: encoded } });
                                    } else if (data.paymentType === 'PS') {
                                        this.router.navigate(['/about']);
                                        if (data.responseStatus === 'ACCP') {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'paysuccess');
                                        } else {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'payfailed');
                                        }

                                        // }
                                    } else {
                                        this.notify.update('Message: <br/>' + JSON.stringify(msg), 'note');
                                    }
                                    this.messageSource.next(msg);

                                })
                            )
                            .subscribe();
                    }
                });

        });


    }


    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    close() {
        this.menu.close();
    }

    logout() {
        this.auth.signOut(this.fcm.getCurrentToken());
    }
}
