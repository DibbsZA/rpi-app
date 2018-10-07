import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { AuthSvcService } from './auth-svc.service';
import { NotifyService } from './notify.service';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FcmService {

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
        if (token !== undefined) {

            console.log(token);
            return this.saveTokenToFirestore(token);
        }
    }

    private async saveTokenToFirestore(token) {
        // throw new Error('Method not implemented.');
        if (!token) {
            this.notify.update('no token on save', 'error');
            return;
        }

        const devicesRef = this.afs.collection('devices');
        const user = await this.auth.getCurrentUser();

        const docData = {
            token,
            userId: user.uid
        };

        return devicesRef.doc(token).set(docData)
            .then(r => {
                this.notify.update('token saved <br /> ' + JSON.stringify(docData), 'note');
            });
    }

    // Listen for token refresh
    public monitorTokenRefresh(): Observable<any> {
        if (this.platform.is('cordova')) {
            console.log('Getting messaging token');
            return this.firebaseNative.onTokenRefresh()
                .pipe(
                    tap(token => {
                        this.notify.update('Native token refreshed <br>' + JSON.stringify(token), 'info');
                        this.saveTokenToFirestore(token);
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

}
