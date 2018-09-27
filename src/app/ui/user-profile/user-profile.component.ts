import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';
import { Route, Router } from '@angular/router';
import { AuthSvcService } from '../../core/auth-svc.service';
import { MenuController } from '@ionic/angular';
import { FcmService } from '../../core/fcm.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    userO: iUser;

    constructor(
        public auth: AuthSvcService,
        private router: Router,
        public menu: MenuController,
        private fcmSvc: FcmService,
    ) {
        this.auth.user.subscribe(x => { this.userO = x });
    }

    ngOnInit() {

    }

    tokenRefresh() {
        this.fcmSvc.monitorRefresh(this.userO);
    }

    openProfileEdit() {
        this.menu.close();
        this.router.navigateByUrl('/profile');
    }

    logout() {
        this.auth.signOut();
    }

}
