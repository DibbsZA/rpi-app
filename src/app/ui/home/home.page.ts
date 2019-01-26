import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { UserProfile } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PspService } from '../../services/psp.service';
import { DataService } from '../../services/data.service';
import { LoadingController } from '@ionic/angular';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

    user: Observable<firebase.User | null>;
    myPsp: string = null;
    pspApiUrl: String;
    userO: UserProfile;
    loading: HTMLIonLoadingElement;

    // client = {} as iUser;

    constructor(
        public auth: AuthService,
        public router: Router,
        public notify: NotifyService,
        public userSvc: UserService,
        public pspService: PspService,
        public dataSvc: DataService,
        public loadingController: LoadingController
    ) {
        this.user = this.auth.user;
    }

    ngOnInit(): void {

        this.presentLoadingWithOptions();
        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;
                this.dataSvc.pspApiUrl
                    .subscribe(api => {
                        this.pspApiUrl = api;
                        this.checkAuth();
                    })
            });

    }

    async presentLoadingWithOptions() {
        this.loading = await this.loadingController.create({
            spinner: 'bubbles',
            message: 'Checking Auth status. Hold on...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        return await this.loading.present();
    }

    checkAuth() {
        if (this.pspApiUrl != undefined && this.pspApiUrl != null) {

            if (this.user !== null) {
                this.user.subscribe(
                    async x => {
                        console.log(x);
                        if (x !== null) {

                            this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);

                            this.loading.dismiss();

                            if (this.userO.queryLimit !== undefined) {
                                return this.afterSignIn();
                            } else {
                                this.notify.update('Please update your profile next!!!.', 'info');
                                this.router.navigate(['/profile']);
                            }

                        } else {

                            this.loading.dismiss();
                            this.notify.update('Please sign in...', 'info');
                        }
                    },
                    e => {
                        console.error(e);
                    });
            }
        } else {
            this.loading.dismiss();
            this.notify.update('You need to configure your Network settings first.', 'note');
            this.router.navigate(['/settings']);
        }
    }

    async login(email, pwd) {

        // this.dataSvc.saveKey('myPSP', this.myPsp);

        if (this.pspApiUrl != undefined && this.pspApiUrl != null) {
            return this.auth.emailLogin(email, pwd, this.myPsp)
                .then(result => {
                    console.log(result);
                    if (result) {
                        this.afterSignIn();
                    }
                });
        } else {
            this.notify.update('You need to configure your Network settings first.', 'note');
            return this.router.navigate(['/settings']);
        }


    }

    register() {
        return this.router.navigate(['/registration']);
    }


    /// Shared
    private async afterSignIn() {
        // Do after login stuff here, such router redirects, toast messages, etc.

        if (this.pspApiUrl != undefined && this.pspApiUrl != null) {
            this.notify.update('You are logged in. Let\'s start...', 'success');
            return this.router.navigate(['/about']);
        }

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
