import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { iAccount, iUser } from '../models/interfaces';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NotifyService } from './notify.service';

@Injectable({
    providedIn: 'root'
})
export class UserServiceService {

    private user: firebase.User;

    constructor(
        // private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        public notify: NotifyService,
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
            email: user.email.trimRight().toLowerCase() || null,
            displayName: user.displayName || null,
            nickname: user.nickname || null,
            photoURL: user.photoURL || '/assets/img/sun-dog.png',
            phone: user.phone || null,
            pspId: user.pspId || null,
            zapId: user.zapId || null,
            //  accounts: user.accounts || []
            // fcmTokens: user.fcmTokens || null
        };
        userRef.set(data)
            .then(r => {
                // localStorage.setItem('user', JSON.stringify(data));
                console.log('User saved: ' + JSON.stringify(data));
            });
        return data;
    }

    public getUsers() {
        return this.afs.collection<iUser>('users').valueChanges();
    }

    public getUserAccounts(userId) {
        const colRef = this.afs.collection<iAccount>('accounts', ref => ref
            .where('uid', '==', userId)
            .orderBy('accountAlias'));

        return colRef.valueChanges();
        // return colRef.snapshotChanges();
    }


    public getUserDefaultAccount(userId) {
        const colRef = this.afs.collection<iAccount>('accounts', ref => ref
            .where('uid', '==', userId)
            .where('default', '==', true));

        return colRef.valueChanges();
        // return colRef.snapshotChanges();
    }

    public addUserAccount(account: iAccount) {
        const id = this.afs.createId();
        account.id = id;
        const colRef = this.afs.collection<iAccount>('accounts');
        return colRef.doc(id).set(account);

    }

    public deleteUserAccount(acc) {
        return this.afs.doc(`accounts/${acc.id}`).delete()
            .then(() => {
                this.notify.update('User Account \"' + acc.accountAlias + '\" deleted', 'info');
                return;
            });
    }

}
