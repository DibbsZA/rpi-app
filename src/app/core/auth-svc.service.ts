import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { firebase } from '@firebase/app';
import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

import { iUser } from "../models/interfaces";

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

    anonymousLogin() {
        return this.afAuth.auth
            .signInAnonymously()
            .then(credential => {
                this.notify.update('Welcome to Firestarter!!!', 'success');
                return this.updateUserData(credential.user); // if using firestore
            })
            .catch(error => {
                this.handleError(error);
            });
    }
    //// Email/Password Auth ////

    emailSignUp(email: string, password: string) {
        return this.afAuth.auth
            .createUserWithEmailAndPassword(email, password)
            .then(credential => {
                this.notify.update('Welcome new user!', 'success');
                return this.updateUserData(credential.user); // if using firestore
            })
            .catch(error => this.handleError(error));
    }

    async emailLogin(email: string, password: string) {
        return this.afAuth.auth
            .signInWithEmailAndPassword(email, password)
            .then(credential => {
                this.notify.update('Welcome back!', 'success');
                this.updateUserData(credential.user);
                // .then(r => {
                //     console.log(r);
                //     return credential.user;
                // });
                return credential;
            })
            .catch(error => {
                this.handleError(error);
                return null
            });
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
            this.router.navigate(['/']);
        });
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        console.error(error);
        this.notify.update(error.message, 'error');
    }

    // Sets user data to firestore after succesful login
    async updateUserData(user: iUser) {
        const userRef: AngularFirestoreDocument<iUser> = this.afs.doc(
            `users/${user.uid}`
        );

        const data: iUser = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || 'nameless user',
            photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
            phone: user.phone || null,
            processor: user.processor || null
            // createdAt: user.createdAt || 
            // updatedAt: user.updatedAt
        };
        userRef.set(data);
        return data;
    }
}
