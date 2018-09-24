import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { iUser, iTransaction } from '../models/interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TxnSvcService {

    txnCollection: AngularFirestoreCollection<iTransaction>;
    txnDocRef: AngularFirestoreDocument<iTransaction>;

    transactions: Observable<iTransaction[]>;

    constructor(
        private afs: AngularFirestore,
    ) {

    }


    /**
     * getAllTxn
     * @description Get Last 20 Transactions in DB.
     * @returns {Observable<iTransaction[]>}
     * @memberOf TxnSvcService
     */
    public getAllTxn(): Observable<iTransaction[]> {
        const colRef = this.afs.firestore.collection('/transactions');
        this.txnCollection = this.afs.collection<iTransaction>(colRef, ref => ref.orderBy('originatingDate', 'desc')
            .limit(20));
        this.transactions = this.txnCollection.valueChanges();
        return this.transactions;
    }


    /**
     * getUserTxnHistory
     * @description 'Get last 20 statement for User'
     * @param {string} zapId 'User Id to filter by'
     * @returns {Observable<iTransaction[]>}
     * @memberOf TxnSvcService
     */
    public getUserTxnHistory(zapId: string): Observable<iTransaction[]> {
        const colRef = this.afs.firestore.collection('/transactions');
        this.txnCollection = this.afs.collection<iTransaction>(colRef, ref => ref.where('payInstruction.payeeId', '==', 'zapId')
            .orderBy('originatingDate', 'desc').limit(20));
        return this.transactions;
    }

    /**
     * getTxn
     * @description 'Retrieve a particular Transaction from the database.'
     * @param {iTransaction['txnId']} txnId
     * @returns {Observable<iTransaction>}
     * @memberOf TxnSvcService
     */
    public getTxn(txnId: iTransaction['txnId']): Observable<iTransaction> {
        this.txnCollection = this.afs.collection('/transactions');
        this.txnDocRef = this.txnCollection.doc('${txnId}');
        return this.txnDocRef.valueChanges();
    }


    /**
     * savePayment
     * @description 'Save a User Txn to the DB'
     * @param {iTransaction} txn 'Save a new Txn to the database'
     * @returns {Promise<void>}
     * @memberOf TxnSvcService
     */
    public savePayment(txn: iTransaction): Promise<void> {
        this.txnCollection = this.afs.collection('/transactions');
        this.txnDocRef = this.txnCollection.doc('${txnId}');
        return this.txnDocRef.set(txn);
    }

    /**
     * updatePayment
     * @description 'Update a Payment eg When a PaymentResponse is recieved'
     * @param {iTransaction} txn 'Transaction Data'
     * @returns {Promise<void>}
     * @memberOf TxnSvcService
     */
    public updatePayment(txn: iTransaction): Promise<void> {
        this.txnCollection = this.afs.collection('/transactions');
        this.txnDocRef = this.txnCollection.doc('${txnId}');
        return this.txnDocRef.update(txn);
    }


    /**
     * deletePayment
     * @description 'Delete a Txn from the DB. Admin Only Use'
     * @param {string} txnId 'Transaction ID'
     * @returns {Promise<void>}
     *
     * @memberOf TxnSvcService
     */
    public deletePayment(txnId: string): Promise<void> {
        this.txnCollection = this.afs.collection('/transactions');
        this.txnDocRef = this.txnCollection.doc('${txnId}');
        return this.txnDocRef.delete();
    }
}
