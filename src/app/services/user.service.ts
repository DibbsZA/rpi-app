import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { UserProfile, AccountDetail } from '../models/interfaces.0.2';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';
import * as DataService from "./data.service";
import { HttpClient } from '@angular/common/http';
import { options } from "../config";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private fbUser: firebase.User;
    private appUser: Observable<UserProfile>;

    constructor(
        // private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        public notify: NotifyService,
        private httpClient: HttpClient,
    ) {
    }

    public getUserData(uid) {

        const apiEndpoint = options.pspApiUrl + '/queryClient';

        return this.httpClient.get<UserProfile>(apiEndpoint, { params: { clientKey: uid } }).toPromise();


        // const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
        //     `users/${uid}`
        // );
        // return userRef.valueChanges().toPromise();

    }

    public updateUserData(user: UserProfile) {

        // const userRef: AngularFirestoreDocument<UserProfile> = this.afs.doc(
        //     `users/${user.clientKey}`
        // );

        const apiEndpoint = options.pspApiUrl + '/queryClient';

        // const accounts: iAccount = []

        const data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email.trimRight().toLowerCase() || null,
            name: user.name || null,
            surname: user.surname || null,
            nickname: user.nickname || null,
            photoUrl: user.photoUrl || '/assets/img/sun-dog.png',
            mobileNo: user.mobileNo || null,
            zapId: user.zapId.toUpperCase() || null,
            telegramId: user.telegramId || null
        };
        // userRef.set(data)
        //     .then(r => {
        //         // localStorage.setItem('user', JSON.stringify(data));
        //         console.log('User saved: ' + JSON.stringify(data));
        //     });
        // return data;

        return this.httpClient.post<Response>(apiEndpoint, data).toPromise();
    }

    // public getUsers() {
    //     return this.afs.collection<UserProfile>('users').valueChanges();
    // }

    public getUserAccounts(clientKey) {
        const apiEndpoint = options.pspApiUrl + '/getClientAccounts';
        return this.httpClient.get<AccountDetail[]>(apiEndpoint, { params: { clientKey: clientKey } });

        // const colRef = this.afs.collection<Account>('accounts', ref => ref
        //     .where('uid', '==', userId)
        //     .orderBy('accountAlias'));

        //     return colRef.valueChanges();
    }

    // FIXME: Need to determine default account from above list which is probably already in memory

    // public getUserDefaultAccount(userId) {

    //     const apiEndpoint = options.pspApiUrl + '/getClientAccounts';
    //     return this.httpClient.get<AccountDetail>(apiEndpoint, { params: { clientKey: userId } });

    //     // const colRef = this.afs.collection<Account>('accounts', ref => ref
    //     //     .where('uid', '==', userId)
    //     //     .where('default', '==', true));

    //     // return colRef.valueChanges();
    // }

    public addClientAccount(account: AccountDetail) {
        const apiEndpoint = options.pspApiUrl + '/addClientAccount';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

        // const id = this.afs.createId();
        // account.id = id;
        // const colRef = this.afs.collection<Account>('accounts');
        // return colRef.doc(id).set(account);

    }

    public deleteClientAccount(account: AccountDetail) {
        const apiEndpoint = options.pspApiUrl + '/deleteClientAccount';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

        // return this.afs.doc(`accounts/${acc.id}`).delete()
        //     .then(() => {
        //         this.notify.update('User Account \"' + acc.accountAlias + '\" deleted', 'info');
        //         return;
        //     });
    }

}
