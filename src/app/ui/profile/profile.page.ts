import { Component, OnInit } from '@angular/core';
import { AuthSvcService } from '../../core/auth-svc.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser, iAccount, iProcessor } from '../../models/interfaces';
import { UserServiceService } from '../../core/user-service.service';
import { DataServiceService } from '../../core/data-service.service';
import { NotifyService } from '../../core/notify.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    userO: Observable<iUser>;
    dirtyUser: iUser;
    accounts: Observable<iAccount[]>;
    editMode = false;
    processors: Observable<iProcessor[]>;
    payerPspLable = '@psp';
    payeePspLable = '@psp';
    progress = 0;

    constructor(
        public auth: AuthSvcService,
        private dataSvc: DataServiceService,
        private router: Router,
        private notify: NotifyService,
        private userSvc: UserServiceService,
    ) {
        this.userO = this.auth.user;

    }

    ngOnInit() {

        this.processors = this.dataSvc.getProcessors();
        this.userO.subscribe(
            x => {
                this.accounts = this.userSvc.getUserAccounts(x.uid);
                if (x !== null) {
                    this.dirtyUser = x;
                    if (this.dirtyUser.pspId != null) {
                        this.payerPspLable = '@' + this.dirtyUser.pspId;
                    }
                }

            }
        );
    }

    canDeactivate(): Observable<boolean> | boolean {
        console.log('CanDeactivate!.');
        if (this.editMode) {
            this.notify.update('Please save your profile before leaving this page.', 'note');
            return false;
        }
        return true;
    }

    doRefresh(event) {
        console.log('Begin async operation');
        this.ngOnInit();

        setTimeout(() => {
            console.log('Async operation has ended');
            event.target.complete();
        }, 2000);
    }

    // TODO:  edit user details and ZAP details
    editProfile() {
        this.editMode = true;

    }

    saveProfile(displayName, pspId: string, zapId: string, nickname) {
        this.editMode = false;
        this.dirtyUser.displayName = displayName;
        this.dirtyUser.nickname = nickname;
        this.dirtyUser.zapId = zapId.toUpperCase();
        this.dirtyUser.pspId = pspId.toUpperCase();

        this.userSvc.updateUserData(this.dirtyUser)
            .then(r => {
                this.notify.update('Profile Updated. That\'s awesome!', 'success');
            });

    }

    addAccount() {
        this.router.navigate(['/account']);
    }

    deleteAccount(acc) {

        console.log(acc);
        this.userSvc.deleteUserAccount(acc);

        // this.userSvc.updateUserData(this.dirtyUser)
        // .then(r => {
        //     this.notify.update("User Account Deleted", "info");
        // });

    }

    private payerPspSelect(psp) {
        if (psp !== undefined && psp !== null) {

            this.payerPspLable = '@' + psp;
        }
    }

}
