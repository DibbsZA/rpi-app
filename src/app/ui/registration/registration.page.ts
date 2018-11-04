import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
    myPsp: string;

    constructor(
        public auth: AuthService,
        private router: Router,
        public notify: NotifyService
    ) { }

    ngOnInit() {


    }

    // loginPage() {
    //     return this.router.navigate(['/home']);
    // }

    register(email, pwd, pspId) {

        let ls = localStorage.getItem('myPSP');

        if (ls != undefined && ls != null) {
            this.myPsp = ls;

        } else {
            console.log("AuthSvc: Can't read the PSP name from localstorage!!!!!");
            localStorage.setItem('myPSP', pspId);
            this.myPsp = pspId;
        }

        this.auth.emailSignUp(email, pwd, this.myPsp)
            .then((res) => {
                console.log(res);
                if (res !== undefined) {
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
