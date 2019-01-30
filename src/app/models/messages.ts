// /**
//  *Payment Instruction Message
//  *
//  * @export
//  * @interface msgPaymentInstruction
//  */
// export interface msgPaymentInstruction {
//     payerId: string;
//     payerPSP: string;
//     consentKey: string;
//     payerAccountNo: string;
//     payeeId: string;
//     payeePSP: string;
//     amount?: number;
//     userRef: string | null;
//     payerName?: string;
//     originatingDate?: string;
//     mpiHash?: string;
//     uniqueRef?: string

// }

// // TODO: This message comes in the GCM message
// export interface msgPaymentInstructionFCMResponse {
//     uniqueRef: string;
//     payerId: string;
//     payerPSP: string;
//     payeeId: string;
//     payeePSP: string;
//     amount?: number;
//     userRef?: string;
//     payerName?: string;
//     originatingDate?: string;
//     settlementDate?: string;
//     responseCode?: string;
//     responseDesc?: string;
// }


// export interface msgPaymentAuth {
//     uniqueRef: string;
//     payerId: string;
//     payerPSP: string;
//     payerName: string;
//     payeeId: string;
//     payeePSP: string;
//     payeeAccountNo: string;
//     amount?: number;
//     userRef?: string;
//     originatingDate?: string;
//     responseCode?: string;
//     responseDesc?: string;
// }


// export interface msgConfirmation {
//     responseCode?: string;
//     responseDesc?: string;
//     uniqueRef?: string;
// }

// /**
//  *
//  *
//  * @export
//  * @interface msgPSPPayment
//  * @property
//  */
// export interface msgPSPPayment {

//     /**
//      * Unique Transaction Reference per PSP
//      *
//      * @type {(string | null)}
//      * @memberof msgPSPPayment
//      */
//     uniqueRef?: string | null;
//     payerId?: string | null;
//     payerPSP?: string | null;
//     payerName?: string | null;
//     payerAccountNo?: string | null;
//     consentKey?: string | null;
//     payeeId?: string | null;
//     payeePSP?: string | null;
//     payeeName?: string | null;
//     payeeAccountNo?: string | null;
//     amount?: number | null;
//     userRef?: string | null;
//     originatingDate?: string | null;
//     settlementDate?: string | null;
//     mpiHash?: string | null;
//     responseCode?: string | null;
//     responseDesc?: string | null;
//     click_action?: string | null;
//     msgtype?: string | null;
//     function?: string;
//     body?: string;
//     title?: string;
//     tap?: boolean;
//     recipientId?: string;
//     psp?: string;
// }

// export interface qrCodeSpec {

//     endToEndId: string | null;
//     originatingDate?: string | null;
//     payerId?: string | null;
//     payerName?: string | null;
//     payeeId: string | null;
//     payeeName?: string | null;
//     userRef?: string | null;
//     amount?: number | null;
// }

