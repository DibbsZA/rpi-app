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
import { UserProfile, FirebaseUser } from '../models/interfaces.0.2';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<firebase.User | null>;
    userProfile: UserProfile;
    myPsp: string;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private fcm: FcmService,
        private notify: NotifyService,
        private userSvc: UserService,
        public dataSvc: DataService,
        public platform: Platform
    ) {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                console.log('AuthSvc: Init -> user = ' + JSON.stringify(user));
                if (user) {

                    return of(user);

                } else {
                    console.log("AuthSvc: User Not Logged in!!!!!");
                    return of(null);
                }
            })
        );
        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;
                console.log('Auth Service: myPsp = ', psp);
            });
    }

    async getCurrentUser(): Promise<any> {
        return this.user.toPromise();
    }

    //// Email/Password Auth ////
    async emailSignUp(email: string, password: string, pspId: string) {
        if (this.userProfile !== null && this.userProfile !== undefined) {

            if (this.userProfile.queryLimit === undefined) {
                const newUser: UserProfile = {
                    clientKey: this.userProfile.clientKey,
                    email: this.userProfile.email,
                    name: '',
                    surname: '',
                    nickname: '',
                    mobileNo: '',
                    telegramId: '',
                    zapId: '',
                    pspId: pspId
                };

                console.log('New User: ' + JSON.stringify(newUser));
                return this.userSvc.registerUser(newUser, pspId);
            }


        } else {
            return this.afAuth.auth
                .createUserWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
                .then(credential => {
                    this.notify.update('<b>Hey there, welcome to Z@P!</b> <br><br>Please remember to update your Profile.', 'note');

                    // this.dataSvc.saveKey('MyPSP', pspId);
                    const newUser: UserProfile = {
                        clientKey: credential.user.uid,
                        email: credential.user.email,
                        name: '',
                        surname: '',
                        nickname: '',
                        mobileNo: '',
                        telegramId: '',
                        zapId: '',
                        pspId: pspId
                    };

                    console.log('New User: ' + JSON.stringify(newUser));
                    return this.userSvc.registerUser(newUser, pspId);
                })
                .catch(error => this.handleError(error));
        }
    }

    async emailLogin(email: string, password: string, pspId) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
            .then(credential => {
                // this.dataSvc.saveKey('MyPSP', pspId);
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

    async signOut(token) {
        await this.dataSvc.deleteKey('MyPSP');
        await this.dataSvc.deleteKey('PspApiUrl');
        this.notify.update('Deleting token: ' + token, 'info');
        await this.fcm.unregister();
        await this.afs.doc(`devices/${token}`).delete();


        this.afAuth.auth.signOut().then(() => {
            this.user = null;
            navigator['app'].exitApp();
        });
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);
        this.notify.update(error.message, 'error');
    }

}
