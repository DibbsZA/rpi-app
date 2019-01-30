import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FcmService } from '../../services/fcm.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/interfaces.0.3';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

    user: Observable<firebase.User>;
    userO: UserProfile;
    userObservable: Observable<UserProfile>;
    token: string;
    myPsp: string;

    constructor(
        public auth: AuthService,
        public userSvc: UserService,
        private router: Router,
        public menu: MenuController,
        private fcmSvc: FcmService,
        private notify: NotifyService,
        public dataSvc: DataService
    ) {

        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;
                if (this.myPsp !== undefined && this.myPsp !== null) {
                    this.user = this.auth.user;
                } else {
                    console.log("AuthSvc: Can't read the PSP name from app storage!!!!!");
                    return;
                }
            });


    }

    ngOnInit() {

        if (this.user != undefined) {

            this.user.subscribe(
                async x => {
                    if (x === null) {
                        return this.router.navigateByUrl('/home');
                    }
                    this.userObservable = this.userSvc.observeUsers(x.uid);
                    this.userO = await this.userSvc.getUserData(x.uid);
                    if (this.userO.queryLimit === null) {
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
