import { Injectable } from '@angular/core';
import { msgPSPPayment, qrCodeSpec } from '../models/messages';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {

    constructor(
    ) {
    }

    /**
     * encodeQR
     */
    public encodeQR(jsonData: any) {
        const converted = this.converter(jsonData);
        const serialised = this.serialise(converted);
        return serialised;
    }

    /**
     * decodeQR
     */
    public decodeQR(qrData) {
        const deserialised = this.deserialise(qrData);
        return deserialised;
    }

    private serialise(data: qrCodeSpec): string {
        /**
        * Data will be serialized in the order below
        */

        let serial = data.uniqueRef;
        serial += '|' + data.payerId;
        serial += '|' + data.payerPSP;
        serial += '|' + data.payerName;
        serial += '|' + data.payerAccountNo;
        serial += '|' + data.consentKey;
        serial += '|' + data.payeeId;
        serial += '|' + data.payeePSP;
        serial += '|' + data.payeeName;
        serial += '|' + data.payeeAccountNo;
        serial += '|' + data.userRef;
        serial += '|' + data.amount.toString();
        serial += '|' + data.originatingDate;
        serial += '|' + data.mpiHash;

        console.log(serial);

        return serial;
    };


    private deserialise(qrdata: string): msgPSPPayment {

        let dataArray = qrdata.split('|');

        let decoded: msgPSPPayment = {
            uniqueRef: dataArray.shift(),
            payerId: dataArray.shift(),
            payerPSP: dataArray.shift(),
            payerName: dataArray.shift(),
            payerAccountNo: dataArray.shift(),
            consentKey: dataArray.shift(),
            payeeId: dataArray.shift(),
            payeePSP: dataArray.shift(),
            payeeName: dataArray.shift(),
            payeeAccountNo: dataArray.shift(),
            userRef: dataArray.shift(),
            amount: parseInt(dataArray.shift()),
            originatingDate: dataArray.shift(),
            mpiHash: dataArray.shift()
        }

        console.log(decoded);

        return decoded;
    };

    private converter(msgData: any): qrCodeSpec {

        let payload = msgData;

        let qrData: qrCodeSpec = {
            uniqueRef: '',
            payerId: payload.payerId || '',
            payerPSP: payload.payerPSP || '',
            payerName: payload.payerName || '',
            payerAccountNo: payload.payerAccountNo || '',
            consentKey: payload.consentKey || '',
            payeeId: payload.payeeId || '',
            payeePSP: payload.payeePSP || '',
            payeeName: payload.payeeName || '',
            payeeAccountNo: payload.payeeAccountNo || '',
            userRef: payload.userRef || '',
            amount: payload.amount || 0,
            originatingDate: payload.originatingDate || '',
            mpiHash: payload.mpiHash || ''
        }

        return qrData;
    }

}
