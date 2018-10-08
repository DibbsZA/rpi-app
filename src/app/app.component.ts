import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FcmService } from './core/fcm.service';
import { NotifyService } from './core/notify.service';
import { AuthSvcService } from './core/auth-svc.service';
import { tap } from 'rxjs/operators';
import { msgPSPPayment } from './models/messages';
import { Subject } from 'rxjs';

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
        { title: 'History', url: '/history', icon: 'paper', loggedin: true },
        { title: 'Profile', url: '/profile', icon: 'contact', loggedin: true },
        { title: 'About', url: '/about', icon: 'information-circle-outline' }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private menu: MenuController,
        public fcm: FcmService,
        public notify: NotifyService,
        public auth: AuthSvcService
    ) {

    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.splashScreen.hide();
        });
        this.auth.user
            .subscribe(user => {
                this.loggedin = true;

                if (user) {
                    this.fcm.getToken();

                    this.fcm.monitorTokenRefresh().subscribe();

                    this.fcm.listenToNotifications()
                        .pipe(
                            tap(msg => {
                                if (msg === null) {
                                    return;
                                }
                                this.notify.update(JSON.stringify(msg), 'note');
                                // tslint:disable-next-line:prefer-const
                                let data: msgPSPPayment = msg.data;
                                data.click_action = msg.notification.click_action;
                                data.msg_type = msg.data.msgtype;

                                console.log('Message received. ', msg);
                                this.notify.update(data, 'action');
                                this.messageSource.next(msg);

                            })
                        )
                        .subscribe();
                }
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
}
