import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    constructor(public auth: AuthSvcService,
        private afAuth: AngularFireAuth,
        private router: Router) { }

    ngOnInit() {
    }

    loginPage() {
        return this.router.navigate(['/home']);
    }

    register(email, pwd) {

        return this.auth.emailSignUp(email, pwd)
            .then(res => {
                console.log(res);
                this.router.navigate(['/home']);
            })
            .catch(e => {
                console.error(e);
            })
    }
}
