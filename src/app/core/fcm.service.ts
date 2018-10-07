import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
// import * as firebase from 'firebase';
import { Subject, Observable, of } from 'rxjs';
import { AuthSvcService } from './auth-svc.service';
import { NotifyService } from './notify.service';
import { msgPaymentAuth, msgPSPPayment } from '../models/messages';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FcmService {

    // private messaging = firebase.messaging();
    private messageSource = new Subject();
    currentMessage = this.messageSource.asObservable();


    constructor(
        public firebaseNative: Firebase,
        public afs: AngularFirestore,
        private auth: AuthSvcService,
        private platform: Platform,
        private notify: NotifyService
    ) {


    }

    async getToken() {
        let token;

        if (this.platform.is('cordova')) {
            const status = await this.firebaseNative.hasPermission();

            if (status.isEnabled) {
                console.log('messaging permission already granted');
                return;
            }

            token = await this.firebaseNative.getToken();

            if (this.platform.is('ios')) {
                console.log('ios messaging get permission');
                await this.firebaseNative.grantPermission();
            }
        }
        // } else {
        //     token = await this.messaging.requestPermission()
        //         .then(() => {
        //             console.log('pwa messaging permission already granted');
        //             // this.notify.update('Notify permission granted.', 'success');
        //             return this.messaging.getToken();
        //         });

        // }
        console.log(token);
        return this.saveTokenToFirestore(token);
    }

    private async saveTokenToFirestore(token) {
        // throw new Error('Method not implemented.');
        if (!token) { return; }
        const devicesRef = this.afs.collection('devices');
        const user = await this.auth.getCurrentUser();

        const docData = {
            token,
            userId: user.uid
        };

        return devicesRef.doc(token).set(docData);

    }


    // get permission to send messages
    // NOTE: deprecated in due to native token handling above
    // getPermission() {
    //    this.messaging.requestPermission()
    //       .then(() => {
    //          // this.notify.update('Notify permission granted.', 'success');
    //          return this.messaging.getToken();
    //       })
    //       .then(token => {
    //          console.log(token);
    //          // this.notify.update(token, 'success');
    //          this.saveTokenToFirestore(token);
    //       })
    //       .catch((err) => {
    //          this.notify.update('Unable to get permission to notify.', 'error');
    //       });
    // }

    // Listen for token refresh
    public monitorTokenRefresh(): Observable<any> {
        console.log('Getting messaging token');
        if (this.platform.is('cordova')) {
            return this.firebaseNative.onTokenRefresh()
                .pipe(
                    tap(token => {
                        this.notify.update('Native token refreshed <br>' + token, 'info');
                        this.saveTokenToFirestore(token);
                    })
                );
        } else {
            return of(null);
        }
        // } else {
        //     this.messaging.onTokenRefresh(
        //         x => {
        //             this.messaging.getToken()
        //                 .then(token => {
        //                     this.notify.update('Web token refreshed <br>' + token, 'info');
        //                     this.saveTokenToFirestore(token);
        //                 })
        //                 .catch(err => this.notify.update('Unable to retrieve new token', 'error'));
        //         },
        //         err => {

        //         });
        //     return new Observable<any>();
        // }

    }

    // NOTE: Deprecated as above
    // save the permission token in firestore
    // private saveToken(user, token): void {

    //    const userRef = this.afs.collection('users').doc(user.uid);
    //    user.fcmTokens = token;
    //    userRef.set(user);
    // }

    // used to show message when app is open
    receiveMessages() {

        return this.firebaseNative.onNotificationOpen();


        // this.messaging.onMessage(payload => {
        //     // tslint:disable-next-line:prefer-const
        //     let data: msgPSPPayment = payload.data;
        //     data.click_action = payload.notification.click_action;
        //     data.msg_type = payload.data.msgtype;

        //     console.log('Message received. ', payload);
        //     this.notify.update(data, 'action');
        //     this.messageSource.next(payload);
        // });

    }

}
