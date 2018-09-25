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
    accounts: iAccount[];
    displayName?: string;
    nickname?: string | null;
    pspId?: string | null;
    phone?: string | null;
    photoURL?: string | '/assets/img/avatar-default.png';
    zapId?: string | null;
    authSecret?: string | null;
    fcmTokens?: { [token: string]: true };
}

/**
 * Definition of a PSP
 *
 * @export
 * @interface iProcessor
 */
// tslint:disable-next-line:class-name
export interface iProcessor {
    id: string;
    name: string;
    sponsor: string;
    apiUrl?: string;
}
/**
 * Nominated Account definition
 *
 * @export
 * @interface iAccount
 */
// tslint:disable-next-line:class-name
export interface iAccount {
    accountNo?: string;
    accountAlias?: string;
}

// tslint:disable-next-line:class-name
export interface iTransaction {
    id?: string;
    txnOwner: string;
    payMessage: msgPSPPayment;
    payConfirm: msgConfirmation;
    time: number;
}
