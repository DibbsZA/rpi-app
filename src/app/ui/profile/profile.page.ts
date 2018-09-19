import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser, iAccount } from '../../models/interfaces';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { UserServiceService } from '../../core/user-service.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    userO: Observable<iUser>;
    dirtyUser: iUser;
    editMode: boolean = false;

    constructor(
        public auth: AuthSvcService,
        private router: Router,
        public toastController: ToastController,
        private userSvc: UserServiceService,
        public loadingController: LoadingController
    ) {
        this.userO = this.auth.user;
        this.userO.subscribe(
            x => {
                this.dirtyUser = x;
            }
        );
    }

    ngOnInit() {
    }

    // TODO:  edit user details and ZAP details
    editProfile() {
        this.editMode = true;

    }

    saveProfile(displayName, pspId, zapId, nickname) {
        this.editMode = false;
        this.dirtyUser.displayName = displayName;
        this.dirtyUser.nickname = nickname;
        this.dirtyUser.zapId = zapId;
        this.dirtyUser.pspId = pspId;

        this.userSvc.updateUserData(this.dirtyUser)
            .then(r => {
                this.presentToast("user Updated Successful");
            });

    }

    addAccount() {
        this.router.navigate(['/account']);
    }

    deletAccount(acc: iAccount) {
        let index = this.dirtyUser.accounts.indexOf(acc);
        this.dirtyUser.accounts.splice(index);
        this.loadingController.create().then(loading => {
            loading.present()
            return this.userSvc.updateUserData(this.dirtyUser)
                .then(r => {
                    loading.dismiss();
                    return this.presentToast("user Account Deleted");
                });
        }  
    }

    public async presentToast(msg) {

        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

}
