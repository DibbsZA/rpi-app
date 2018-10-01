import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { iUser, iTransaction } from '../models/interfaces';
import { Observable } from 'rxjs';
import { expand, takeWhile, mergeMap, take, map } from 'rxjs/operators';

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

        this.txnCollection = this.afs.collection<iTransaction>('transactions');
    }

    public getAllTxn() {
        this.txnCollection = this.afs.collection<iTransaction>('transactions', ref => ref.orderBy('time', 'desc').limit(20));

        return this.txnCollection.valueChanges();
    }


    public getUserTxnHistory(zapId: string): Observable<iTransaction[]> {
        const colRef = this.afs.firestore.collection('transactions');
        this.txnCollection = this.afs.collection<iTransaction>(colRef, ref => ref.where('txnOwner', '==', zapId)
            .orderBy('time', 'desc').limit(10));
        return this.txnCollection.valueChanges();
    }

    public getTxn(txnId): Observable<iTransaction> {
        this.txnCollection = this.afs.collection<iTransaction>('transactions');
        this.txnDocRef = this.txnCollection.doc(txnId);
        return this.txnDocRef.valueChanges();
    }


    public savePayment(txn: iTransaction) {
        this.txnCollection = this.afs.collection<iTransaction>('transactions');
        // return this.txnCollection.add(txn);

        return this.txnCollection.add(txn).then(ref => {
            // add the returned is to the txn and update the values again.
            txn.id = ref.id;
            return this.updatePayment(txn);
        });
    }

    public updatePayment(txn: iTransaction) {
        this.txnCollection = this.afs.collection<iTransaction>('transactions');
        this.txnDocRef = this.txnCollection.doc(txn.id);
        return this.txnDocRef.update(txn);
    }

    public deletePayment(txnId: string): Promise<void> {
        this.txnCollection = this.afs.collection<iTransaction>('transactions');
        this.txnDocRef = this.txnCollection.doc(txnId);
        return this.txnDocRef.delete();
    }
}
