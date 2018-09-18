import { Component } from '@angular/core';

import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public appPages = [
        // { title: 'Login', url: '/home', icon: 'home' },
        { title: 'Pay', url: '/pay', icon: 'cash' },
        { title: 'Scan', url: '/scan', icon: 'aperture' },
        { title: 'Profile', url: '/profile', icon: 'contact' },
        { title: 'About', url: '/about', icon: 'information-circle-outline' }
    ];

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
