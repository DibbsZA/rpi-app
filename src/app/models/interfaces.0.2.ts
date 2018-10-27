
/**
 * Payemnt Initiation Message
 *
 * @export
 * @interface PaymentInitiation
 */
export interface PaymentInitiation {
    channel: string;
    originatingDate: string;
    clientKey: string;
    consentKey: string;
    payerAccountRef: string;
    payerName: string;
    amount: string;
    userRef: string | null;
    payeeId: string;
    payeeMobileNo: string;
    payeeEmail: string;
}

export interface PaymentInstructionResponse {
    endToEndId: string;
    originatingDate: string;
    clientKey: string;
    payeeAccountRef: string;
    responseStatus: string;
}

export interface PaymentRequestInitiation {
    channel: string;
    originatingDate: string;
    amount: string;
    clientKey: string;
    payerId: string;
    payerMobileNo: string;
    payerEmail: string;
    payeeName: string;
    payeeAccountRef: number;
    userRef: string;
}

export interface PaymentRequestResponse {
    endToEndId: string;
    originatingDate: string;
    clientKey: string;
    consentKey: string;
    payerAccountRef: number;
    responseStatus: string;
}

export interface Response {
    responseCode: string;
    responseDesc: string;
    responseStatus: string;
    endToEndId: string;
}

export interface Transaction {
    endToEndId: string;
    clientKey?: string;
    channel?: string | null;
    originatingDate?: string;
    settlementDate?: string | null;
    amount?: number | null;
    payerId?: string | null;
    payerMobileNo?: string | null;
    payerEmail?: string | null;
    payerName?: string | null;
    payerAccountRef: number | null;
    consentKey?: string | null;
    payeeId?: string | null;
    payeeMobileNo?: string | null;
    payeeEmail?: string | null;
    payeeName?: string | null;
    payeeAccountRef: number | null;
    userRef?: string | null;
    responseStatus?: string | null;
    responseCode?: string | null;
    responseDesc?: string | null;
}

export interface QrcodeSpec {

    endToEndId: string;
    channel: string;
    originatingDate: string;
    payerId?: string | null;
    payerPSP?: string | null;
    payerName?: string | null;
    payerAccountNo?: string | null;
    consentKey?: string | null;
    payeeId: string | null;
    payeePSP: string | null;
    payeeName?: string | null;
    payeeAccountNo?: string | null;
    userRef?: string | null;
    amount?: number | null;
}

export interface FirebaseUser {
    uid: string;
    email: string;
    photoUrl?: string;
    displayName?: string;
}

export interface UserProfile {
    clientKey: string;
    email: string;
    name?: string | null;
    surname?: string | null;
    zapId?: string | null;
    nickname?: string | null;
    mobileNo?: string | null;
    telegramId?: string | null;
    photoUrl?: string | null;
    queryLimit?: string | null;
    preAuth?: string | null;
}

export interface AccountDetail {
    clientKey: string;
    accountRef: string;
    accountNo: string;
    accountAlias: string;
    default: boolean;
}

export interface Processor {
    id: string;
    name: string;
    sponsor: string;
    apiUrl?: string;
}

export enum ChannelCode {
    App = '00',
    MobileNo = '02',
    Telegram = '10',
    WhatsApp = '11'
}