import { Component, OnInit } from '@angular/core';
import { iUser, iAccount } from '../../models/interfaces';
import { UserServiceService } from '../../core/user-service.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {

    user: Observable<iUser>;
    userO: iUser;
    newAccount: iAccount;

    constructor(
        private auth: AuthSvcService,
        private userSvc: UserServiceService,
        public toastController: ToastController,
        private router: Router
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {
        this.user.subscribe(
            x => {
                this.userO = x;
            }
        )
    }

    save(accountAlias, accountNo) {
        this.newAccount = {
            accountAlias: accountAlias,
            accountNo: accountNo
        }
        this.userO.accounts.push(this.newAccount);
        this.userSvc.updateUserData(this.userO)
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
