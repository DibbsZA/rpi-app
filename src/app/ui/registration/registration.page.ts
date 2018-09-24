import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifyService } from '../../core/notify.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    constructor(public auth: AuthSvcService,
        private afAuth: AngularFireAuth,
        private router: Router,
        public notify: NotifyService
    ) { }

    ngOnInit() {
    }

    loginPage() {
        return this.router.navigate(['/home']);
    }

    register(email, pwd) {

        this.auth.emailSignUp(email, pwd)
            .then((res) => {
                console.log(res);
                if (res == undefined) {
                    this.router.navigate(['/profile']);
                }
                else {
                    this.notify.update('Register failed', 'error');
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }
}
