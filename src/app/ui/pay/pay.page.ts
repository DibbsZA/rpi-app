import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {

    constructor() { }

    ngOnInit() {
    }

    public optionsFn(data): void { //here item is an object 
        alert("clicked" + data)
    }

    public doPay(pay) {
        alert(pay);
    }
}
