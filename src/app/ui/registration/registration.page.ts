import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';
import { DataService } from '../../services/data.service';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    myPsp: string;
    pspApiUrl: string;
    registerForm: FormGroup;

    constructor(
        public auth: AuthService,
        private router: Router,
        public notify: NotifyService,
        public dataSvc: DataService,
        private formBuilder: FormBuilder,
        private _location: Location
    ) {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;
            });
        this.dataSvc.pspApiUrl
            .subscribe(uri => {
                this.pspApiUrl = uri;
            });
    }

    ngOnInit() {


    }

    back() {
        return this._location.back();
    }

    register(email, pwd) {

        if (this.myPsp !== undefined && this.myPsp !== null) {

            if (this.pspApiUrl != undefined && this.pspApiUrl != null) {
                this.auth.emailSignUp(email, pwd, this.myPsp)
                    .then((res) => {
                        console.log(res);
                        if (res !== undefined) {
                            this.notify.update('Please update your profile next!!!.', 'info');
                            this.router.navigate(['/profile']);

                        }
                        else {
                            this.notify.update('Register failed', 'error');
                        }

                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                this.notify.update('You first need to configure your Network Settings.', 'note');
                this.router.navigate(['/settings']);
            }



        } else {
            console.log("AuthSvc: Can't read the PSP name from app storage!!!!!");
        }

    }
}
