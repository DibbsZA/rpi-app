import { Injectable } from '@angular/core';

@Injectable()
export class Config {
    static;

}

export const firebaseConfig = {
    apiKey: "AIzaSyD2iajLNujWYitbs6IWWDPdzMmQTAHLLRM",
    authDomain: "zapmobile-954c4.firebaseapp.com",
    databaseURL: "https://zapmobile-954c4.firebaseio.com",
    projectId: "zapmobile-954c4",
    storageBucket: "zapmobile-954c4.appspot.com",
    messagingSenderId: "393591030275"
};

export const options = {
    pspApiUrl: 'https://cloud-dev.bankservafrica.com/PSP/v0.2.0/',
    version: 'v1.3.2'
};
