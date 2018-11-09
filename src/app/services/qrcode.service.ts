import { Injectable } from '@angular/core';
import { Transaction, QrcodeSpec } from '../models/interfaces.0.2';

@Injectable({
    providedIn: 'root'
})
export class QrcodeService {

    // constructor() { }

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

    private serialise(data: QrcodeSpec): string {
        /**
        * Data will be serialized in the order below
        */

        let serial = data.endToEndId;
        serial += '|' + data.payerId;
        serial += '|' + data.dummy1;
        serial += '|' + data.payerName;
        serial += '|' + data.payeeId;
        serial += '|' + data.dummy2;
        serial += '|' + data.payeeName;
        serial += '|' + data.dummy3;
        serial += '|' + data.userRef;
        serial += '|' + data.amount.toString();
        serial += '|' + data.originatingDate;

        console.log(serial);

        return serial;
    };


    private deserialise(qrdata: string): Transaction {

        let dataArray = qrdata.split('|');

        let decoded: Transaction = {
            endToEndId: dataArray.shift(),
            payerId: dataArray.shift(),
            dummy1: dataArray.shift(),
            payerName: dataArray.shift(),
            payeeId: dataArray.shift(),
            dummy2: dataArray.shift(),
            payeeName: dataArray.shift(),
            dummy3: dataArray.shift(),
            userRef: dataArray.shift(),
            amount: parseInt(dataArray.shift()),
            originatingDate: dataArray.shift()
        }

        console.log(decoded);

        return decoded;
    };

    private converter(msgData: any): QrcodeSpec {

        let payload = msgData;

        let qrData: QrcodeSpec = {
            endToEndId: '',
            payerId: payload.payerId || '',
            payerName: payload.payerName || '',
            payeeId: payload.payeeId || '',
            payeeName: payload.payeeName || '',
            userRef: payload.userRef || '',
            amount: payload.amount || 0,
            originatingDate: payload.originatingDate || ''
        }

        return qrData;
    }

}
