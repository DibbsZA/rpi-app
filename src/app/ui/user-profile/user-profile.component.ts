import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/interfaces';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FcmService } from '../../services/fcm.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/interfaces.0.2';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    user: Observable<firebase.User>;
    userO: UserProfile;
    userObservable: Observable<UserProfile[]>;
    token: string;
    myPsp: string;

    constructor(
        public auth: AuthService,
        public userSvc: UserService,
        private router: Router,
        public menu: MenuController,
        private fcmSvc: FcmService,
        private notify: NotifyService,
    ) {

        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls != undefined && ls != null) {
            this.myPsp = ls;
        } else {
            console.log("AuthSvc: Can't read the PSP name from localstorage!!!!!");
            return;
        }
    }

    ngOnInit() {

        this.user.subscribe(
            async x => {
                if (x === null) {
                    return;
                }
                this.userObservable = this.userSvc.observeUsers(x.uid, this.myPsp);
                this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                if (this.userO.queryLimit == null) {
                    this.notify.update('Please update your profile first!!!.', 'info');
                    this.router.navigate(['/profile']);

                } else {
                    this.userO.pspId = this.myPsp;

                    this.fcmSvc.firebaseNative.getToken()
                        .then(t => {
                            this.token = t;
                        });
                }
            });
    }

    openProfileEdit() {
        this.menu.close();
        this.router.navigateByUrl('/profile');
    }

    logout() {
        this.auth.signOut(this.token);
        this.menu.close();
        this.router.navigateByUrl('/');
    }

}
