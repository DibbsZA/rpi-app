import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { iProcessor } from '../models/interfaces';

@Injectable({
    providedIn: 'root'
})
export class DataServiceService {

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
    public getProcessor(pspID): Observable<iProcessor> {
        this.docRefProcessor = this.afs.doc('/processors/${pspID}')
        return this.docRefProcessor.valueChanges();
    }
}

