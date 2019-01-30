import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UserProfile, AccountDetail } from '../models/interfaces.0.3';

import { NotifyService } from './notify.service';
import { DataService } from './data.service';


/**
 * Handle comunication with the PSP User & Admin API
 *
 * @export
 * @class UserService
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {

    pspApiUrl: string;

    constructor(
        public notify: NotifyService,
        private httpClient: HttpClient,
        public dataSvc: DataService,
    ) {

        this.dataSvc.pspNonFinUrl
            .subscribe(uri => {
                this.pspApiUrl = uri;
            });
    }


    public observeUsers(clientKey: string) {

        const apiEndpoint = this.pspApiUrl + '/queryClient';

        return this.httpClient.get<UserProfile>(apiEndpoint, { params: { clientKey: clientKey } });

    }

    public getUserData(clientKey: string) {

        const apiEndpoint = this.pspApiUrl + '/queryClient';

        return this.httpClient.get<UserProfile>(apiEndpoint, { params: { clientKey: clientKey } }).toPromise()
            .then(
                r => {
                    if (r !== null) {
                        let u = r;
                        return u;
                    }
                }
            );

    }

    public registerUser(user: UserProfile) {

        const apiEndpoint = this.pspApiUrl + '/addClient';

        let data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email.trimRight().toLowerCase(),
            name: '',
            surname: '',
            nickname: ''
        };

        if (user.name !== undefined) {
            data.name = user.name.trimRight();
        };
        if (user.surname !== undefined) {
            data.surname = user.surname.trimRight();
        };
        if (user.nickname !== undefined) {
            data.nickname = user.nickname.trimRight();
        };
        if (user.mobileNo !== undefined) {
            data.mobileNo = user.mobileNo.trimRight();
        };
        if (user.zapId !== undefined) {
            data.zapId = user.zapId.trimRight().toUpperCase();
        };

        data.queryLimit = 10;
        // data.preAuth = false;

        return this.httpClient.post<Response>(apiEndpoint, data).toPromise();

    }

    public updateUserData(user: UserProfile) {

        const apiEndpoint = this.pspApiUrl + '/updateClient';

        let data: UserProfile = {
            clientKey: user.clientKey,
            email: user.email
        };

        if (user.name !== undefined) {
            data.name = user.name.trimRight();
        };
        if (user.surname !== undefined) {
            data.surname = user.surname.trimRight();
        };
        if (user.nickname !== undefined) {
            data.nickname = user.nickname.trimRight();
        };
        if (user.mobileNo !== undefined) {
            data.mobileNo = user.mobileNo.trimRight();
        };
        if (user.zapId !== undefined) {
            data.zapId = user.zapId.trimRight().toUpperCase();
        };
        if (user.photoUrl !== undefined) {
            data.photoUrl = user.photoUrl.trimRight();
        } else {
            data.photoUrl = '/assets/img/sun-dog.png';
        };
        data.queryLimit = 10;

        return this.httpClient.post<Response>(apiEndpoint, data).toPromise();
    }

    public getUserAccounts(clientKey: string) {

        const apiEndpoint = this.pspApiUrl + '/getClientAccounts';

        return this.httpClient.get<AccountDetail[]>(apiEndpoint, { params: { clientKey: clientKey } });

    }

    public addClientAccount(account: AccountDetail) {

        const apiEndpoint = this.pspApiUrl + '/addClientAccount';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

    }

    public deleteClientAccount(account: AccountDetail) {

        const apiEndpoint = this.pspApiUrl + '/deleteClientAccount';

        return this.httpClient.post<Response>(apiEndpoint, account).toPromise();

    }

}
