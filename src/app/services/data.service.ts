import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { iProcessor } from '../models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    docRefProcessor: AngularFirestoreDocument<iProcessor>;
    colRefProcessor: AngularFirestoreCollection<iProcessor>;

    constructor(
        private afs: AngularFirestore,
    ) {

    }

    /**
     * name
     */
    public getProcessors() {
        this.colRefProcessor = this.afs.collection('/processors')
        return this.colRefProcessor.valueChanges();
    }

    /**
     * getProcessor
     */
    public getProcessor(pspID) {
        let doc = this.afs.doc<iProcessor>(`/processors/${pspID}`);
        return doc.valueChanges()

    }
}

