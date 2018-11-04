import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Processor } from '../models/interfaces.0.2';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    docRefProcessor: AngularFirestoreDocument<Processor>;
    colRefProcessor: AngularFirestoreCollection<Processor>;

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
        let doc = this.afs.doc<Processor>(`/processors/${pspID}`);
        return doc.valueChanges()

    }
}

