import { Component, OnInit } from '@angular/core';
import { iUser, iAccount } from '../../models/interfaces';
import { UserServiceService } from '../../core/user-service.service';
import { Router } from '@angular/router';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Observable } from 'rxjs';
import { NotifyService } from '../../core/notify.service';

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
        private notify: NotifyService,
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
                this.notify.update('Account Added.', 'success')
                return this.router.navigateByUrl('/profile');
            });
    }
}
