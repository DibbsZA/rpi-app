import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { FcmService } from './services/fcm.service';
import { NotifyService } from './services/notify.service';
import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { options } from './config';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Transaction, UserProfile, ResponseStatus } from './models/interfaces.0.3';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

    loggedin = false;
    private messageSource = new Subject();
    currentMessage = this.messageSource.asObservable();

    public appPages = [
        { title: 'Pay', url: '/payment/pay', icon: 'cash', icon2: 'arrow-round-forward', loggedin: true },
        // { title: 'Request Payment', url: '/payment/requestpay', icon: 'cash', icon2: 'arrow-round-back', loggedin: true },
        { title: 'Scan to Pay', url: '/payment/pay', icon: 'qr-scanner', loggedin: true },
        { title: 'My Profile', url: '/profile', icon: 'contact', loggedin: true },
        { title: 'Settings', url: '/settings', icon: 'cog', loggedin: true },
        { title: 'About', url: '/about', icon: 'information-circle-outline', loggedin: true },
        { title: 'Login', url: '/home', icon: 'log-in', loggedin: false }
    ];

    appVersion: string;
    appCodeName: string;
    user: Observable<firebase.User>;
    userO: UserProfile;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private menu: MenuController,
        public fcm: FcmService,
        public notify: NotifyService,
        public auth: AuthService,
        public router: Router,
    ) {
        this.user = this.auth.user;
        this.appVersion = options.version;
        this.appCodeName = options.codeName;
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.appVersion = options.version;
            this.splashScreen.hide();
            this.user
                .subscribe(user => {
                    this.loggedin = true;

                    if (user) {
                        this.userO = user.providerData[0];
                        console.log('app.component: ', user);
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
                                    this.router.navigate(['/about']);
                                    if (data.amount !== undefined) {

                                        // Payment Recipient Detailed Message
                                        if (ResponseStatus.ACPT === data.responseStatus) {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'paysuccess');
                                        } else {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'payfailed');
                                        }

                                    } else {

                                        // Payment Sender Status Message

                                        if (ResponseStatus.ACPT === data.responseStatus) {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'paysuccess');
                                        } else {
                                            this.notify.update('Message: <br/>' + JSON.stringify(msg), 'payfailed');
                                        }

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
