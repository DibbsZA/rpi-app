import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService } from '../../core/user-service.service';
import { iUser } from '../../models/interfaces';

@Component({
    selector: 'app-account',
    templateUrl: './account.page.html',
    styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

    constructor(
        private router: Router,
        private userSvc: UserServiceService
    ) {

    }

    ngOnInit() {
    }

    gotoProfile() {
        this.router.navigateByUrl('/profile');
    }



}
