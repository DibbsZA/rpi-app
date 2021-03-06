import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { NotifyService } from './notify.service';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FcmService {

    currentToken: string;

    constructor(
        public firebaseNative: Firebase,
        public afs: AngularFirestore,
        private platform: Platform,
        private notify: NotifyService
    ) {


    }

    async getToken(user) {
        let token;

        if (this.platform.is('android')) {

            token = await this.firebaseNative.getToken()
        }

        if (this.platform.is('ios')) {
            token = await this.firebaseNative.getToken();
            const perm = await this.firebaseNative.grantPermission();
        }

        if (token !== undefined) {

            console.log(token);
            this.currentToken = token;
            return this.saveTokenToFirestore(token, user);
        }
    }

    public getCurrentToken() {
        return this.currentToken;
    }

    private async saveTokenToFirestore(token, user: firebase.User) {
        // throw new Error('Method not implemented.');
        if (!token) {
            this.notify.update('no token on save', 'error');
            return;
        }

        const devicesRef = this.afs.collection('devices');


        const docData = {
            token,
            userId: user.uid
        };

        return devicesRef.doc(token).set(docData);
        // .then(r => {
        // this.notify.update('token saved <br /> ' + JSON.stringify(docData), 'note');
        // });
    }

    // Listen for token refresh
    public monitorTokenRefresh(user): Observable<any> {
        if (this.platform.is('cordova')) {
            console.log('Getting messaging token');
            return this.firebaseNative.onTokenRefresh()
                .pipe(
                    tap(token => {
                        // this.notify.update('Native token refreshed <br>' + JSON.stringify(token), 'info');
                        this.saveTokenToFirestore(token, user);
                    })
                );
        } else {
            console.log('No token for web app');
            return of(null);
        }
    }


    // used to show message when app is open
    listenToNotifications() {
        if (this.platform.is('cordova')) {
            return this.firebaseNative.onNotificationOpen();
        } else {
            return of(null);
        }
    }

    unregister() {
        if (this.platform.is('cordova')) {
            return this.firebaseNative.unregister();
        } else {
            return of(null);
        }
    }

}
