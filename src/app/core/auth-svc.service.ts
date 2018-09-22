import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

import { iUser } from '../models/interfaces';
import { UserServiceService } from './user-service.service';

@Injectable({
    providedIn: 'root'
})
export class AuthSvcService {
    user: Observable<iUser | null>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        private notify: NotifyService,
        private userSvc: UserServiceService

    ) {
        this.user = this.afAuth.authState.pipe(
            switchMap(user => {
                if (user) {
                    return this.afs.doc<iUser>(`users/${user.uid}`).valueChanges();
                } else {
                    return of(null);
                }
            }),
            tap(user => localStorage.setItem('user', JSON.stringify(user))),
            startWith(JSON.parse(localStorage.getItem('user')))
        );

    }
    //// Anonymous Auth ////

    async anonymousLogin() {
        return this.afAuth.auth
            .signInAnonymously()
            .then(credential => {
                this.notify.update('Welcome to ZAP!!!', 'success');
                return credential;
                // return this.updateUserData(credential.user); // if using firestore
            })
            // .catch(error => {
            //     const err = { code: 'error', message: error.message };
            //     return err;
            // });
            .catch(error => this.handleError(error));
    }
    //// Email/Password Auth ////

    async emailSignUp(email: string, password: string) {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(credential => {
                this.notify.update('Welcome to ZAP!!!', 'success');
                const newUser: iUser = {
                    uid: credential.user.uid,
                    email: credential.user.email
                };
                return this.userSvc.updateUserData(newUser);
            })
            .catch(error => this.handleError(error));
        // .catch(error => {
        //     // this.handleError(error);
        //     const err = { code: 'error', message: error.message };
        //     return err;
        // });
    }

    async emailLogin(email: string, password: string) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(credential => {
                this.notify.update('Welcome back!', 'success');
                return credential;
                // this.updateUserData(credential.user);
                // .then(r => {
                //     console.log(r);
                //     return credential.user;
                // });
                // return this.userSvc.getUserData(credential.user.uid);
            })
            .catch(error => this.handleError(error));
        // .catch(error => {
        //     const err = { code: 'error', message: error.message };
        //     return err;
        // });
    }

    // Sends email allowing user to reset password
    resetPassword(email: string) {
        const fbAuth = auth();

        return fbAuth
            .sendPasswordResetEmail(email)
            .then(() => this.notify.update('Password update email sent', 'info'))
            .catch(error => this.handleError(error));
    }

    signOut() {
        this.afAuth.auth.signOut().then(() => {
            this.user = null;
            this.router.navigate(['/']);
        });
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);
        this.notify.update(error.message, 'error');
    }

}
