//
// FIN Messages in the New RPI
//
//

export interface CreditTransferMSG {
    endToEndId?: string;
    originatingDate: string;
    payerId: string;
    payeeId: string;
    payerBankId: string;
    payeeBankId: string;
    amount: string;
    userRef: string | null;
    payerAccount: string;
    payeeAccount: string;
    supDebtorData?: string;
    supCreditorData?: string;
    currencyCode: string;
    clientKey?: string;
}

export interface PaymentStatusMSG {
    endToEndId: string;
    originatingDate: string;
    clientKey?: string;
}

export interface PaymentStatusReportMSG {
    endToEndId: string;
    originatingDate: string;
    supDebtorData?: string;
    supCreditorData?: string;
    responseDesc?: string;
    responsepaymentStatus?: string;
    responseCode?: string;
    clientKey?: string;
}


export interface Transaction {
    clientKey: string;
    endToEndId: string;
    originatingDate?: string;
    settlementDate?: string | null;
    payerId?: string;
    payeeId?: string;
    payerAccount?: string;
    payeeAccount?: string;
    payerBankId?: string;
    payeeBankId?: string;
    amount?: string;
    userRef?: string | null;
    supDebtorData?: string;
    supCreditorData?: string;
    responseStatus?: string | null;
    responseCode?: string | null;
    responseDesc?: string | null;
}

//
// NON-FIN Messages in the New RPI
//
//

export interface Processor {
    id: string;
    name: string;
    rpi2Fin?: string;
    rpi2Admin?: string;
    active?: boolean;
    uriBSV?: string;
    uriGCC?: string;
    uriHP?: string;
}


export interface FirebaseUser {
    uid: string;
    email: string;
    photoUrl?: string;
    displayName?: string;
}

export interface UserProfile {
    clientKey?: string;
    email: string;
    displayName?: string;
    name?: string | '';
    surname?: string | '';
    zapId?: string | '';
    pspId?: string | '';
    nickname?: string | '';
    mobileNo?: string | '';
    telegramId?: string | '';
    photoUrl?: string | '';
    queryLimit?: number | '';
    accountRef?: string | '1';
}

export interface AccountDetail {
    clientKey: string;
    accountRef?: string;
    accountNo: string;
    accountAlias: string;
    balance: string;
    default: boolean;
}

export interface QrcodeSpec {
    payeeId: string | null;
    payeeBankId?: string | null;
    payeeAccount?: string | null;
    // payerId?: string | null;
    // payerBankId?: string | null;
    userRef?: string | null;     // Ref for reconciliation eg. POS Order No. 
    amount?: string | null;
    originatingDate?: string;    // Merchant should set this initial field
    supCreditorData?: string;    // This can be populated by Cart Order details etc.
}




export interface ApiResponse {
    responseCode?: string;
    responseDesc?: string;
    responseStatus?: string;
    endToEndId?: string;
}


export enum ResponseStatus {
    ACPT = 'ACCP',
    ACPW = 'ACPW',
    RJCT = 'RJCT',
    DECL = 'DECL',
    AUTH = 'AUTH',
}
