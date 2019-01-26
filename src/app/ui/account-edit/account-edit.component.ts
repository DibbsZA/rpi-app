import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { UserProfile, AccountDetail } from '../../models/interfaces.0.2';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-account-edit',
    templateUrl: './account-edit.component.html',
    styleUrls: ['./account-edit.component.scss']
})
export class AccountEditComponent implements OnInit {

    user: Observable<firebase.User>;
    userProfile: Observable<UserProfile>;
    userO: firebase.User;
    newAccount: AccountDetail;
    myPsp: string = null;

    constructor(
        private auth: AuthService,
        private userSvc: UserService,
        private notify: NotifyService,
        private router: Router,
        public dataSvc: DataService
    ) {
        this.user = this.auth.user;


    }

    ngOnInit() {
        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;
            });

        this.user.subscribe(
            x => {
                this.userO = x;
            }
        );
    }

    save(accountAlias: string, accountNo: string, nominated: boolean) {
        this.newAccount = {
            accountAlias: accountAlias.trim(),
            accountNo: accountNo.trim(),
            clientKey: this.userO.uid,
            default: nominated
        };
        // this.userO.accounts.push(this.newAccount);
        this.userSvc.addClientAccount(this.newAccount, this.myPsp)
            .then(r => {
                this.notify.update('Account Added.', 'success');
                return this.router.navigateByUrl('/profile');
            });
    }
}
