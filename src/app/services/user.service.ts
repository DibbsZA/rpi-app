import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Account, UserProfile } from '../models/interfaces.0.2';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';
import * as DataService from "./data.service";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private user: firebase.User;

    constructor(
        // private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        public notify: NotifyService,
        private httpClient: HttpClient,
    ) {
    }

    public getUserData(uid): Promise<UserProfile> {
        const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
            `users/${uid}`
        );
        return userRef.valueChanges().toPromise();
    }

    public async updateUserData(user: UserProfile) {

        const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
            `users/${user.clientKey}`
        );

        // const accounts: iAccount = []

        const data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email.trimRight().toLowerCase() || null,
            name: user.name || null,
            surname: user.surname || null,
            nickname: user.nickname || null,
            photoUrl: user.photoUrl || '/assets/img/sun-dog.png',
            mobileNo: user.mobileNo || null,
            zapId: user.zapId || null,
            telegramId: user.telegramId || null
        };
        userRef.set(data)
            .then(r => {
                // localStorage.setItem('user', JSON.stringify(data));
                console.log('User saved: ' + JSON.stringify(data));
            });
        return data;
    }

    public getUsers() {
        return this.afs.collection<UserProfile>('users').valueChanges();
    }

    public getUserAccounts(userId) {
        const colRef = this.afs.collection<Account>('accounts', ref => ref
            .where('uid', '==', userId)
            .orderBy('accountAlias'));

        return colRef.valueChanges();
        // return colRef.snapshotChanges();
    }


    public getUserDefaultAccount(userId) {
        const colRef = this.afs.collection<Account>('accounts', ref => ref
            .where('uid', '==', userId)
            .where('default', '==', true));

        return colRef.valueChanges();
        // return colRef.snapshotChanges();
    }

    public addUserAccount(account: Account) {
        const id = this.afs.createId();
        account.id = id;
        const colRef = this.afs.collection<Account>('accounts');
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
