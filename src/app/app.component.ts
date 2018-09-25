import { Component, OnInit } from '@angular/core';

// import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from './core/fcm.service';
import { NotifyService } from './core/notify.service';
import { filter, take } from "rxjs/operators";
import { AuthSvcService } from './core/auth-svc.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    public appPages = [
        { title: 'Login', url: '/home', icon: 'home' },
        { title: 'Pay', url: '/pay', icon: 'cash' },
        { title: 'Scan', url: '/scan', icon: 'aperture' },
        { title: 'History', url: '/history', icon: 'paper' },
        { title: 'Profile', url: '/profile', icon: 'contact' },
        { title: 'About', url: '/about', icon: 'information-circle-outline' }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private menu: MenuController,
        public fcm: FcmService,
        public notify: NotifyService,
        public auth: AuthSvcService
    ) {

    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.statusBar.hide();
            this.splashScreen.hide();


        });
        this.auth.user
            .subscribe(user => {
                if (user) {
                    this.fcm.getPermission(user)
                    this.fcm.monitorRefresh(user)
                    this.fcm.receiveMessages()
                }
            })
    }


    close() {
        this.menu.close();
    }
}
