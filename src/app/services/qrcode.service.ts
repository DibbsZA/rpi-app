import { Injectable } from '@angular/core';
import { Transaction, QrcodeSpec } from '../models/interfaces.0.3';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {

    // constructor() { }

    /**
     * encodeQR
     */
    // public encodeQR(jsonData: any) {
    //     const converted = this.converter(jsonData);
    //     const serialised = this.serialise(converted);
    //     return serialised;
    // }

    /**
     * decodeQR
     */
    public decodeQR(qrData) {
        const deserialised = this.deserialise(qrData);
        return deserialised;
    }

    // private serialise(data: QrcodeSpec): string {
    //     /**
    //     * Data will be serialized in the order below
    //     */

    //     let serial = data.payeeId;
    //     serial += '|' + data.payerId;
    //     serial += '|' + data.dummy2;
    //     serial += '|' + data.payeeName;
    //     serial += '|' + data.dummy3;
    //     serial += '|' + data.userRef;
    //     serial += '|' + data.amount.toString();
    //     serial += '|' + data.originatingDate;

    //     console.log(serial);

    //     return serial;
    // };


    private deserialise(qrdata: string): Transaction {

        let dataArray = qrdata.split('|');

        let decoded: Transaction = {
            clientKey: dataArray.shift(),
            endToEndId: dataArray.shift(),
            payerId: dataArray.shift(),
            payerBankId: dataArray.shift(),
            payeeId: dataArray.shift(),
            payeeBankId: dataArray.shift(),
            payeeAccount: dataArray.shift(),
            userRef: dataArray.shift(),
            amount: dataArray.shift(),
            originatingDate: dataArray.shift()
        }

        console.log(decoded);

        return decoded;
    };

    private converter(msgData: any): QrcodeSpec {

        let payload = msgData;

        let qrData: QrcodeSpec = {
            payeeId: payload.payeeId || '',
            payeeAccount: payload.payeeAccount || '',
            payeeBankId: payload.payeeBankId || '',
            userRef: payload.userRef || '',
            amount: payload.amount || '0',
            originatingDate: payload.originatingDate || '',
            supCreditorData: payload.supCreditorData || ''
        }

        return qrData;
    }

}
