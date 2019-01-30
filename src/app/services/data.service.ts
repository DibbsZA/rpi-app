import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Processor } from '../models/interfaces.0.3';

import { fromPromise } from 'rxjs/observable/fromPromise';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    docRefProcessor: AngularFirestoreDocument<Processor>;
    colRefProcessor: AngularFirestoreCollection<Processor>;

    myPsp: Observable<string>;
    pspNonFinUrl: Observable<any>;
    pspFinUrl: Observable<any>;

    constructor(
        private afs: AngularFirestore,
        private storage: Storage
    ) {

        this.myPsp = this.loadPSP();
        this.pspNonFinUrl = this.loadNonFinUrl();
        this.pspFinUrl = this.loadFinUrl();
    }

    public getProcessors() {
        this.colRefProcessor = this.afs.collection('/processors')
        return this.colRefProcessor.valueChanges();
    }

    public getProcessor(pspID) {
        let doc = this.afs.doc<Processor>(`/processors/${pspID}`);
        return doc.valueChanges()
    }


    loadPSP() {
        return fromPromise(this.storage.get('MyPSP'));
    }

    public loadFinUrl() {
        return fromPromise(this.storage.get('PspFinUrl'));
    }

    public loadNonFinUrl() {
        return fromPromise(this.storage.get('PspNonFinUrl'));
    }

    public saveKey(key: string, data: string) {
        return this.storage.set(key, data);
    }

    public deleteKey(key: string) {
        return this.storage.remove(key);
    }

}
