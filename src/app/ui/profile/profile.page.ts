import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser, iAccount, iProcessor } from '../../models/interfaces';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { UserServiceService } from '../../core/user-service.service';
import { DataServiceService } from '../../core/data-service.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    userO: Observable<iUser>;
    dirtyUser: iUser;
    editMode: boolean = false;
    processors: Observable<iProcessor[]>;
    payerPspLable: string = '@psp';
    payeePspLable: string = '@psp';

    constructor(
        public auth: AuthSvcService,
        private dataSvc: DataServiceService,
        private router: Router,
        public toastController: ToastController,
        private userSvc: UserServiceService,
    ) {
        this.userO = this.auth.user;

    }

    ngOnInit() {

        this.processors = this.dataSvc.getProcessors();
        this.userO.subscribe(
            x => {
                this.dirtyUser = x;
                if (this.dirtyUser.pspId != null) {
                    this.payerPspLable = '@' + this.dirtyUser.pspId;
                }
            }
        );
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

    deleteAccount(acc: iAccount) {
        var dirtyAccounts: iAccount[] = this.dirtyUser.accounts;
        let index = dirtyAccounts.indexOf(acc);
        this.dirtyUser.accounts.splice(index);
        return this.userSvc.updateUserData(this.dirtyUser)
            .then(r => {
                return this.presentToast("user Account Deleted");
            });
    }

    private payerPspSelect(psp) {
        if (psp != undefined && psp != null) {

            this.payerPspLable = '@' + psp;
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
