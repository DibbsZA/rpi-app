
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

export interface ApiResponse {
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
    payerAccountRef?: number | null;
    consentKey?: string | null;
    payeeId?: string | null;
    payeeMobileNo?: string | null;
    payeeEmail?: string | null;
    payeeName?: string | null;
    payeeAccountRef?: number | null;
    userRef?: string | null;
    paymentType?: string | null;
    responseStatus?: string | null;
    responseCode?: string | null;
    responseDesc?: string | null;
}

export interface QrcodeSpec {

    endToEndId: string;
    originatingDate?: string;
    payerId?: string | null;
    payerName?: string | null;
    payeeId: string | null;
    payeeName?: string | null;
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
    name?: string | '';
    surname?: string | '';
    zapId?: string | '';
    pspId?: string | '';
    nickname?: string | '';
    mobileNo?: string | '';
    telegramId?: string | '';
    photoUrl?: string | '';
    queryLimit?: number | '';
    preAuth?: boolean | '';
    accountRef?: string | '1';
}

export interface AccountDetail {
    clientKey: string;
    accountRef?: string;
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

export enum ResponseStatus {
    ACPT = 'ACCP',
    ACPW = 'ACPW',
    RJCT = 'RJCT',
    DECL = 'DECL',
    AUTH = 'AUTH',
}
