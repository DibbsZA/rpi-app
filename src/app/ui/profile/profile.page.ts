import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    userO: Observable<iUser>;

    constructor(
        public auth: AuthSvcService,
        private router: Router,
    ) {
        this.userO = this.auth.user;
    }

    ngOnInit() {
    }

    // TODO:  edit user details and ZAP details
    editProfile() {

    }
}
