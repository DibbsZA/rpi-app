import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotifyService } from '../../services/notify.service';
import { UserProfile, AccountDetail, Processor } from '../../models/interfaces.0.2';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { ModalController } from '@ionic/angular';
import { AccountEditComponent } from '../account-edit/account-edit.component';


const themes = {
    autumn: {
        primary: '#ffce00',
        secondary: '#4D9078',
        tertiary: '#B4436C',
        light: '#FDE8DF',
        medium: '#FCD0A2',
        dark: '#333'
    },
    night: {
        primary: '#2B59C3',
        secondary: '#FFC43D',
        tertiary: '#1B9AAA',
        light: '#F8FFE5',
        medium: '#EF476F',
        dark: '#333'
    },
    neon: {
        primary: '#39BFBD',
        secondary: '#4CE0B3',
        tertiary: '#FF5E79',
        light: '#F4EDF2',
        medium: '#B682A5',
        dark: '#34162A'
    },
    default: {
        primary: '#3880ff',
        secondary: '#0cd1e8',
        tertiary: '#7044ff',
        success: '#10dc60',
        dark: '#333',
        medium: '#989aa2',
        light: '#f4f5f8'
    }
};


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
        private router: Router,
        public dataSvc: DataService,
        public auth: AuthService,
        private notify: NotifyService,
        private userSvc: UserService,
        private themeSvc: ThemeService,
        public modalController: ModalController
    ) {
        this.user = this.auth.user;


    }

    ngOnInit() {

        this.dataSvc.myPsp
            .subscribe(psp => {
                this.myPsp = psp;

                if (this.myPsp !== undefined && this.myPsp !== null) {
                    console.log('MyPSP = ', this.myPsp);
                    this.processors = this.dataSvc.getProcessors();
                    this.user.subscribe(
                        async x => {
                            console.log('profile: user -> x = ' + JSON.stringify(x));
                            if (x !== null) {
                                this.userO = await this.userSvc.getUserData(x.uid, this.myPsp);
                                if (this.userO.queryLimit === null) {
                                    this.notify.update('Please update your profile first!!!.', 'info');
                                    this.router.navigate(['/profile']);
                                }
                                this.userO.pspId = this.myPsp;

                                this.accounts = this.userSvc.getUserAccounts(x.uid, this.myPsp);
                                this.dirtyUser = this.userO;

                                if (this.dirtyUser.zapId !== null && this.dirtyUser.zapId !== '') {
                                    // this.payerPspLable = '@' + this.dirtyUser.zapId.split('@').pop();
                                    this.dirtyUser.pspId = this.dirtyUser.zapId.split('@').pop();
                                }
                            }

                        }
                    );
                } else {
                    console.log('ProfilePage: Can\'t read the PSP name from localstorage!!!!!');
                    this.router.navigate(['/home']);
                }
            });

    }

    canDeactivate(): Observable<boolean> | boolean {
        console.log('CanDeactivate!.');
        if (this.editMode) {
            this.notify.update('Please save your profile before leaving this page.', 'note');
            return false;
        }
        return true;
    }

    changeTheme(name) {
        this.themeSvc.setTheme(themes[name]);
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

    saveProfile(name: string, surname: string, email: string, pspId: string, zapId: string,
        nickname: string, mobileNo: string, telegramId: string, photoUrl: string) {
        this.editMode = false;
        this.dirtyUser.name = name.trim();
        this.dirtyUser.surname = surname.trim();
        this.dirtyUser.email = email.trim();
        this.dirtyUser.nickname = nickname.trim();
        this.dirtyUser.zapId = zapId.toUpperCase();
        this.dirtyUser.mobileNo = mobileNo.trim();
        this.dirtyUser.telegramId = telegramId.trim();
        this.dirtyUser.photoUrl = photoUrl.trim();

        this.userSvc.updateUserData(this.dirtyUser, this.myPsp)
            .then(r => {
                this.notify.update('Profile Updated. That\'s awesome!', 'success');
            });

    }

    addAccount() {
        // this.router.navigate(['/account']);
        this.presentModal();
    }

    deleteAccount(acc) {

        acc.clientKey = this.userO.clientKey;
        console.log(acc);
        this.userSvc.deleteClientAccount(acc, this.myPsp);

    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: AccountEditComponent,
            componentProps: {}
        });

        await modal.present();

    }
}
