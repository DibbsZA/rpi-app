import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { UserProfile, AccountDetail } from '../models/interfaces.0.2';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';
import { HttpClient } from '@angular/common/http';
import { options } from "../config";

@Injectable({
    providedIn: 'root'
})
export class UserService {


    constructor(
        public notify: NotifyService,
        private httpClient: HttpClient,
    ) {

    }


    public observeUsers(clientKey, pspId) {

        const apiEndpoint = options.pspApiUrl + pspId + '/queryClient';
        return this.httpClient.get<UserProfile[]>(apiEndpoint, { params: { clientKey: clientKey } });

    }

    public getUserData(clientKey, pspId) {

        const apiEndpoint = options.pspApiUrl + pspId + '/queryClient';

        return this.httpClient.get<UserProfile[]>(apiEndpoint, { params: { clientKey: clientKey } }).toPromise()
            .then(
                r => {
                    if (r.length > 0) {
                        let u = r.shift();
                        return u;
                    }
                }
            );

    }

    public registerUser(user: UserProfile, pspId) {
        localStorage.setItem('myPSP', JSON.stringify(pspId));
        const apiEndpoint = options.pspApiUrl + pspId + '/addClient';

        let data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email.trimRight().toLowerCase(),
            name: '',
            surname: '',
            nickname: ''
        };

        if (user.name != undefined) {
            data.name = user.name.trimRight();
        };
        if (user.surname != undefined) {
            data.surname = user.surname.trimRight();
        };
        if (user.nickname != undefined) {
            data.nickname = user.nickname.trimRight();
        };
        if (user.mobileNo != undefined) {
            data.mobileNo = user.mobileNo.trimRight();
        };
        if (user.zapId != undefined) {
            data.zapId = user.zapId.trimRight().toUpperCase();
        };
        if (user.telegramId != undefined) {
            data.telegramId = user.telegramId.trimRight();
        };
        data.queryLimit = 10;
        data.preAuth = false;

        return this.httpClient.post<Response>(apiEndpoint, data).toPromise();

    }

    public updateUserData(user: UserProfile, pspId) {

        const apiEndpoint = options.pspApiUrl + pspId + '/updateClient';

        let data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email
        };

        if (user.name != undefined) {
            data.name = user.name.trimRight();
        };
        if (user.surname != undefined) {
            data.surname = user.surname.trimRight();
        };
        if (user.nickname != undefined) {
            data.nickname = user.nickname.trimRight();
        };
        if (user.mobileNo != undefined) {
            data.mobileNo = user.mobileNo.trimRight();
        };
        if (user.zapId != undefined) {
            data.zapId = user.zapId.trimRight().toUpperCase();
        };
        if (user.telegramId != undefined) {
            data.telegramId = user.telegramId.trimRight();
        };
        data.queryLimit = 10;
        data.preAuth = false;

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

    public getUserAccounts(clientKey, pspId) {
        const apiEndpoint = options.pspApiUrl + pspId + '/getClientAccounts';
        return this.httpClient.get<AccountDetail[]>(apiEndpoint, { params: { clientKey: clientKey } });

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

    public addClientAccount(account: AccountDetail, pspId) {
        const apiEndpoint = options.pspApiUrl + pspId + '/addClientAccounts';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

    }

    public deleteClientAccount(account: AccountDetail, pspId) {
        const apiEndpoint = options.pspApiUrl + pspId + '/deleteClientAccount';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

    }

}
