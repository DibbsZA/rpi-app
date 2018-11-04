import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { UserProfile, AccountDetail, Processor } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user: Observable<firebase.User>;
    userO: UserProfile;
    dirtyUser: UserProfile;
    accounts: Observable<AccountDetail[]>;
    editMode = false;
    processors: Observable<Processor[]>;
    payerPspLable = '@psp';
    payeePspLable = '@psp';
    progress = 0;
    myPsp: string = null;

    constructor(
        public auth: AuthService,
        private dataSvc: DataService,
        private router: Router,
        private notify: NotifyService,
        private userSvc: UserService,
    ) {
        this.user = this.auth.user;
        let ls = localStorage.getItem('myPSP');

        if (ls != undefined && ls != null) {
            this.myPsp = ls;
        } else {
            console.log("ProfilePage: Can't read the PSP name from localstorage!!!!!");
            return;
        }
    }

    ngOnInit() {

        this.processors = this.dataSvc.getProcessors();
        this.user.subscribe(
            async x => {
                console.log('profile: user -> x = ' + JSON.stringify(x));
                if (x !== null) {
                    this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                    if (this.userO.queryLimit == null) {
                        this.notify.update('Please update your profile first!!!.', 'info');
                        this.router.navigate(['/profile']);
                    }
                    this.userO.pspId = this.myPsp;

                    this.accounts = this.userSvc.getUserAccounts(x.uid, this.myPsp);
                    this.dirtyUser = this.userO;

                    if (this.dirtyUser.zapId != null && this.dirtyUser.zapId != '') {
                        this.payerPspLable = '@' + this.dirtyUser.zapId.split('@').pop();
                        this.dirtyUser.pspId = this.dirtyUser.zapId.split('@').pop();
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

    saveProfile(name: string, surname: string, pspId: string, zapId: string, nickname: string, mobileNo: string, telegramId: string) {
        this.editMode = false;
        this.dirtyUser.name = name.trim();
        this.dirtyUser.surname = surname.trim();
        this.dirtyUser.nickname = nickname.trim();
        this.dirtyUser.zapId = zapId.toUpperCase() + '@' + pspId.toUpperCase();
        this.dirtyUser.mobileNo = mobileNo.trim();
        this.dirtyUser.telegramId = telegramId.trim();
        // this.dirtyUser.photoUrl = photoUrl.trim();

        this.userSvc.updateUserData(this.dirtyUser, this.myPsp)
            .then(r => {
                this.notify.update('Profile Updated. That\'s awesome!', 'success');
            });

    }

    addAccount() {
        this.router.navigate(['/account']);
    }

    deleteAccount(acc) {

        acc.clientKey = this.userO.clientKey;
        console.log(acc);
        this.userSvc.deleteClientAccount(acc, this.myPsp);

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
