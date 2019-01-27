import { msgPSPPayment, msgConfirmation } from './messages';


/**
 * User Profile definition
 *
 * @export
 * @interface iUser
 */
// tslint:disable-next-line:class-name
export interface iUser {
    uid: string;
    email: string;
    accounts?: iAccount[];
    displayName?: string;
    nickname?: string | null;
    pspId?: string | null;
    phone?: string | null;
    photoURL?: string | '/assets/img/sun-dog.png';
    zapId?: string | null;
    telegramId?: string | null;
    whatsappId?: string | null;
}


// tslint:disable-next-line:class-name
export interface iProcessor {
    id: string;
    name: string;
    sponsor: string;
    apiUrl?: string;
}

// tslint:disable-next-line:class-name
export interface iAccount {
    accountNo?: string;
    accountAlias?: string;
    uid?: string;
    id?: string;
    default?: boolean;
    balance?: string;
}

// tslint:disable-next-line:class-name
export interface iTransaction {
    id?: string;
    txnOwner: string;
    direction: string;
    payMessage: msgPSPPayment;
    payConfirm: msgConfirmation;
    time: string;
}
