import { Injectable } from '@angular/core';

import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { FcmService } from './fcm.service';
import { UserService } from './user.service';
import { FirebaseUser, UserProfile } from '../models/interfaces.0.2';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    fbuser: Observable<FirebaseUser>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private fcm: FcmService,
        private notify: NotifyService,
        private userSvc: UserService,
        public platform: Platform
    ) {
        this.fbuser = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    // FIXME: Do http call to get userProfile from PSP
                    // FIXME: Get API Url from local storage or APP config?

                    const apiEndpoint = psp.apiUrl + '/paymentInitiation';

                    // return this.afs.doc<FirebaseUser>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            })
        );
    }

    async getCurrentUser(): Promise<any> {
        return this.fbuser.pipe(first()).toPromise();
    }

    //// Email/Password Auth ////
    async emailSignUp(email: string, password: string) {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
            .then(credential => {
                this.notify.update('<b>Hey there, welcome to Z@P!</b> <br><br>Please remember to update your Profile.', 'note');
                const newUser: UserProfile = {
                    clientKey: credential.user.uid,
                    email: credential.user.email
                };

                console.log('New User: ' + JSON.stringify(newUser));
                return this.userSvc.updateUserData(newUser);
            })
            .catch(error => this.handleError(error));
    }

    async emailLogin(email: string, password: string) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
            .then(credential => {
                this.notify.update('Welcome back to Z@P!', 'success');

                return credential;
            })
            .catch(error => this.handleError(error));
    }

    // Sends email allowing user to reset password
    async resetPassword(email: string) {
        const fbAuth = auth();

        try {
            await fbAuth.sendPasswordResetEmail(email);
            return this.notify.update('Password update email sent', 'info');
        }
        catch (error) {
            return this.handleError(error);
        }
    }

    signOut(token) {
        this.notify.update('Deleting token: ' + token, 'info');
        this.fcm.unregister();
        this.afs.doc(`devices/${token}`).delete();


        this.afAuth.auth.signOut().then(() => {
            this.fbuser = null;
            navigator['app'].exitApp();
        });
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);
        this.notify.update(error.message, 'error');
    }

}
