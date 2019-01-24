import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { UserProfile } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    user: Observable<firebase.User | null>;
    myPsp: string = null;
    userO: UserProfile;

    // client = {} as iUser;

    constructor(
        public auth: AuthService,
        private router: Router,
        public notify: NotifyService,
        public userSvc: UserService,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit(): void {

        if (localStorage.getItem('myPSP') !== undefined) {
            this.myPsp = localStorage.getItem('myPSP');

            if (this.user !== null) {
                this.user.subscribe(
                    async x => {
                        console.log(x);
                        if (x !== null) {


                            this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);

                            if (this.userO.queryLimit !== undefined) {
                                return this.afterSignIn();
                            } else {
                                this.notify.update('Please update your profile first!!!.', 'info');
                                this.router.navigate(['/profile']);
                            }

                        }
                    },
                    e => {
                        console.error(e);
                    });
            }

        }



    }

    async login(email, pwd, pspId) {
        pspId = pspId;
        localStorage.setItem('myPSP', pspId);

        return this.auth.emailLogin(email, pwd, pspId)
            .then(result => {
                console.log(result);
                if (result) {
                    this.afterSignIn();
                }
            });
    }

    register() {
        return this.router.navigate(['/registration']);
    }


    /// Shared
    private async afterSignIn() {
        // Do after login stuff here, such router redirects, toast messages, etc.
        this.notify.update('You are logged in. Let\'s start...', 'success');
        return this.router.navigate(['/about']);
    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }
}
