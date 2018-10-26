import { Component, OnInit } from '@angular/core';
import { iUser, iAccount } from '../../models/interfaces';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthSvcService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';

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
        private userSvc: UserService,
        private notify: NotifyService,
        private router: Router,
    ) {
        this.user = this.auth.user;
    }

    ngOnInit() {
        this.user.subscribe(
            x => {
                this.userO = x;
            }
        );
    }

    save(accountAlias, accountNo, nominated) {
        this.newAccount = {
            accountAlias: accountAlias,
            accountNo: accountNo,
            uid: this.userO.uid,
            default: nominated
        };
        // this.userO.accounts.push(this.newAccount);
        this.userSvc.addUserAccount(this.newAccount)
            .then(r => {
                this.notify.update('Account Added.', 'success');
                return this.router.navigateByUrl('/profile');
            });
    }
}
