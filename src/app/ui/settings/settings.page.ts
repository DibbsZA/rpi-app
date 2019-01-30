import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import { Processor } from '../../models/interfaces.0.3';
import { Location } from '@angular/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    pspApiUrl: string;
    processors: Observable<Processor[]>;
    myPSP: string;
    environment: any;
    savedPSP = false;
    savedAPI = false;

    constructor(
        public router: Router,
        public dataSvc: DataService,
        private _location: Location
    ) {
        this.processors = dataSvc.getProcessors();
    }

    ngOnInit() {

        this.dataSvc.loadPSP().subscribe(r => {
            console.log('loadPsp ', r);
            if (r !== undefined && r != null) {
                this.savedPSP = true;
                this.myPSP = r;
            }
        });
        // this.dataSvc.loadFinUrl().subscribe(r => {
        //     console.log('loadFinUrl ', r);
        //     if (r !== undefined && r != null) {
        //         this.savedAPI = true;
        //         this.pspApiUrl = r;
        //     }
        // });
        this.dataSvc.loadNonFinUrl().subscribe(r => {
            console.log('loadNonFinUrl ', r);
            if (r !== undefined && r != null) {
                this.savedAPI = true;
                this.pspApiUrl = r;
            }
        });

    }

    radioChoice(data) {
        console.log('radio group value: ', data);
        this.environment = data;
    }

    onChange(psp: Processor) {
        console.log('Selected Value', psp);
        switch (this.environment) {
            case 'uriBSV':
                this.pspApiUrl = psp.uriBSV;
                break;

            case 'uriGCC':
                this.pspApiUrl = psp.uriGCC;
                break;

            case 'uriHP':
                this.pspApiUrl = psp.uriHP;
                break;

            case 'rpi2Admin':
                this.pspApiUrl = psp.rpi2Admin;
                break;

            default:
                break;
        }

        this.dataSvc.saveKey('PspApiUrl', this.pspApiUrl)
            .then(() => {
                this.myPSP = psp.id;
                this.savedAPI = true;
            });

        this.dataSvc.saveKey('MyPSP', psp.id)
            .then(() => {
                this.myPSP = psp.id;
                this.savedPSP = true;
            });

    }
    saveClick() {
        this._location.back();
        navigator['app'].exitApp();
    }
    openBrowser(link) {
        window.open(link, '_system', 'location=yes');
    }
}
