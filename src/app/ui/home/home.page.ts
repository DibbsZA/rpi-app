import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';
import { NotifyService } from '../../services/notify.service';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    user: Observable<iUser | null>;

    // client = {} as iUser;

    constructor(
        public auth: AuthSvcService,
        private router: Router,
        public notify: NotifyService
    ) {
        this.user = this.auth.user;
    }

    ngOnInit(): void {
        if (this.user !== null) {
            this.user.subscribe(
                x => {
                    console.log(x);
                    if (x != null) {
                        return this.afterSignIn();
                    }
                },
                e => {
                    console.error(e);
                });
        }

    }

    async login(email, pwd) {

        return this.auth.emailLogin(email, pwd)
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
