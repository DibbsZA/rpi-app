import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import * as firebase from 'firebase';
import { Subject } from 'rxjs';
import { AuthSvcService } from './auth-svc.service';
import { NotifyService } from './notify.service';
import { msgPaymentAuth } from '../models/messages';


@Injectable({
    providedIn: 'root'
})
export class FcmService {

    private messaging = firebase.messaging();
    private messageSource = new Subject();
    currentMessage = this.messageSource.asObservable();


    constructor(
        private auth: AuthSvcService,
        private afs: AngularFirestore,
        private platform: Platform,
        public notify: NotifyService
    ) {


    }

    // get permission to send messages
    getPermission(user) {
        this.messaging.requestPermission()
            .then(() => {
                // this.notify.update('Notify permission granted.', 'success');
                return this.messaging.getToken()
            })
            .then(token => {
                console.log(token)
                // this.notify.update(token, 'success');
                this.saveToken(user, token);
            })
            .catch((err) => {
                this.notify.update('Unable to get permission to notify.', 'error')
            });
    }

    // Listen for token refresh
    monitorRefresh(user) {
        this.messaging.onTokenRefresh(() => {
            this.messaging.getToken()
                .then(refreshedToken => {
                    this.notify.update('Registered for Push Notifications <br>' + refreshedToken, 'error');
                    this.saveToken(user, refreshedToken)
                })
                .catch(err => this.notify.update('Unable to retrieve new token', 'error'));
        });
    }

    // save the permission token in firestore
    private saveToken(user, token): void {

        const userRef = this.afs.collection('users').doc(user.uid);
        user.fcmTokens = token;
        userRef.set(user);
        // .then(r => {
        //     this.notify.update('Token saved.', 'success');
        // });
    }

    // used to show message when app is open
    receiveMessages() {
        this.messaging.onMessage(payload => {
            const data: msgPaymentAuth = payload.data;

            console.log('Message received. ', payload);
            this.notify.update(data, 'action');
            this.messageSource.next(payload)
        });

    }

}
