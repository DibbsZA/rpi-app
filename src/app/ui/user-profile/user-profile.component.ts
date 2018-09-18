import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';
import { Route, Router } from '@angular/router';
import { AuthSvcService } from '../../core/auth-svc.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    userO: Observable<iUser>;

    constructor(
        public auth: AuthSvcService,
        private router: Router,
    ) {
        this.userO = this.auth.user;
    }

    ngOnInit() {

    }

    openProfileEdit() {
        this.router.navigate(['/profile']);
    }

    logout() {
        this.auth.signOut();
    }

}
