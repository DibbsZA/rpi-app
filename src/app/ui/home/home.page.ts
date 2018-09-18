import { Component } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser } from '../../models/interfaces';
// import { User } from '../../models/user';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    user: Observable<iUser | null>;

    // client = {} as iUser;

    constructor(
        public auth: AuthSvcService,
        private afAuth: AngularFireAuth,
        private router: Router
    ) {
        this.user = this.auth.user;

        // this.user.subscribe(
        //     x => {
        //         console.log(x);
        //         if (x != null) {
        //             return this.afterSignIn();
        //         }
        //     },
        //     e => {
        //         console.error(e);
        //     });

    }

    /// Anonymous Sign In
    async signInAnonymously() {
        await this.auth.anonymousLogin();
        return await this.afterSignIn();
    }

    async login(email, pwd) {

        return this.auth.emailLogin(email, pwd)
            .then(result => {
                console.log("home-page.ts")
                console.log(result);
                if (result) {
                    this.router.navigate(['/pay']);
                }
            })
    }

    register() {
        return this.router.navigate(['/registration']);
    }


    /// Shared
    private async afterSignIn() {
        // Do after login stuff here, such router redirects, toast messages, etc.
        console.log(this.user);
        return this.router.navigate(['/pay']);
    }
}
