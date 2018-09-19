import { Component, OnInit } from '@angular/core';
import { iUser, iAccount } from '../../models/interfaces';
import { UserServiceService } from '../../core/user-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {

    user: iUser;
    newAccount: iAccount;

    constructor(
        private userSvc: UserServiceService,
        public toastController: ToastController,
        private router: Router
    ) {
        this.user = userSvc.getLocalUserData()
    }

    ngOnInit() {
    }

    save(accountAlias, accountNo) {
        this.newAccount = {
            accountAlias: accountAlias,
            accountNo: accountNo
        }
        this.user.accounts.push(this.newAccount);
        this.userSvc.updateUserData(this.user)
            .then(r => {
                this.presentToast('Account Added.')
                    .then(done => {
                        return this.router.navigate(['/profile']);
                    });

            });
    }

    public async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000
        });
        toast.present();
    }

}
