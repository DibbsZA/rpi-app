import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../core/user-service.service';
import { iUser } from '../../models/interfaces';

@Component({
    selector: 'app-pay',
    templateUrl: './pay.page.html',
    styleUrls: ['./pay.page.scss'],
})
export class PayPage implements OnInit {
    user: iUser;

    constructor(
        private userSvc: UserServiceService,

    ) {
        this.user = userSvc.getLocalUserData()
    }

    ngOnInit() {
    }

    public optionsFn(data): void { //here item is an object 
        alert("clicked" + data)
    }

    public doPay(pay) {
        alert(pay);
    }
}
