import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { iAccount, iUser } from '../models/interfaces';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserServiceService {

    private user: firebase.User;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
    ) {
        // afAuth.authState.subscribe(user => {
        //     this.user = user;
        // });
    }

    // public getLocalUserData(): iUser {
    //     return JSON.parse(localStorage.getItem('user'));
    // }

    public getUserData(uid): Promise<iUser> {
        const userRef: AngularFirestoreDocument<iUser> = this.afs.doc(
            `users/${uid}`
        );
        return userRef.valueChanges().toPromise();
    }

    public async updateUserData(user: iUser) {
        const userRef: AngularFirestoreDocument<iUser> = this.afs.doc(
            `users/${user.uid}`
        );

        // const accounts: iAccount = []

        const data: iUser = {
            uid: user.uid,
            email: user.email || null,
            displayName: user.displayName || 'nameless user',
            nickname: user.nickname || null,
            photoURL: user.photoURL || '/assets/img/avatar-default.png',
            phone: user.phone || null,
            pspId: user.pspId || null,
            zapId: user.zapId || null,
            accounts: user.accounts || []
        };
        userRef.set(data)
            .then(r => {
                // localStorage.setItem('user', JSON.stringify(data));
                console.log('User saved: ' + JSON.stringify(data));
            });
        return data;
    }
}
