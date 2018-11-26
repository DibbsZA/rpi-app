import { Component, OnInit } from '@angular/core';
import { options } from '../../config';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
    appVersion: string;
    appCodeName: string;

    constructor(

    ) { }

    ngOnInit() {

        this.appVersion = options.version;
        this.appCodeName = options.codeName;
    }

}
