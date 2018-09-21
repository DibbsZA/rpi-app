/**
 * User Profile definition
 *
 * @export
 * @interface iUser
 */
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
    code?: string;
    message?: string;
}

/**
 * Definition of a PSP
 *
 * @export
 * @interface iProcessor
 */
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
export interface iAccount {
    accountNo?: string;
    accountAlias?: string;
}