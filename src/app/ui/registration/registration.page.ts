import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

    constructor(public auth: AuthSvcService,
        private afAuth: AngularFireAuth,
        private router: Router,
        public toastController: ToastController
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
                if (res.code == undefined) {
                    this.router.navigate(['/pay']);
                }
                else {
                    this.presentToast(res.message);
                }

            })
            .catch((err) => {
                console.log(err)
            })
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 4000
        });
        toast.present();
    }
}
