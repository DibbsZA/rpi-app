import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Processor } from '../models/interfaces.0.2';

import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    docRefProcessor: AngularFirestoreDocument<Processor>;
    colRefProcessor: AngularFirestoreCollection<Processor>;

    myPsp: Observable<string>;
    pspApiUrl: Observable<string>;

    constructor(
        private afs: AngularFirestore,
        private storage: Storage
    ) {

        this.myPsp = this.loadPSP();
        this.pspApiUrl = this.loadUrl();
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

    public loadUrl() {
        return fromPromise(this.storage.get('PspApiUrl'));
    }

    public saveKey(key: string, data: string) {
        return this.storage.set(key, data);
    }

    public deleteKey(key: string) {
        return this.storage.remove(key);
    }

}

