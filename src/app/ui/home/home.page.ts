import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';
// import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifyService } from '../../core/notify.service';



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
        private afAuth: AngularFireAuth,
        private router: Router,
        public notify: NotifyService
    ) {
        this.user = this.auth.user;
    }

    ngOnInit(): void {
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

    async login(email, pwd) {

        return this.auth.emailLogin(email, pwd)
            .then(result => {
                console.log("home-page.ts")
                console.log(result);
                if (result) {
                    this.afterSignIn();
                }
            })
    }

    register() {
        return this.router.navigate(['/registration']);
    }


    /// Shared
    private async afterSignIn() {
        // Do after login stuff here, such router redirects, toast messages, etc.
        this.notify.update("You are logged in. Let's start...", 'success')
        return this.router.navigate(['/about']);
    }

}
