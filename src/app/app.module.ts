import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from './config';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { PspService } from './services/psp.service';
import { AuthService } from './services/auth.service';
import { AccountPageModule } from './ui/account/account.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeZa from '@angular/common/locales/en-ZA';
import { FcmService } from './services/fcm.service';
import { QrcodeService } from './services/qrcode.service';
import { ProfilePage } from './ui/profile/profile.page';
import { RegistrationPage } from './ui/registration/registration.page';
import { HomePage } from './ui/home/home.page';
import { AboutPage } from './ui/about/about.page';
import { PayPage } from './ui/pay/pay.page';
import { PayAuthPage } from './ui/pay-auth/pay-auth.page';
import { RequestPayPage } from './ui/request-pay/request-pay.page';
import { RequestPayAuthPage } from './ui/request-pay-auth/request-pay-auth.page';
import { PinComponent } from './ui/pin/pin.component';
import { ZapcurrencyPipe } from './pipes/zapcurrency.pipe';
import { PaySuccessComponent } from './ui/pay-success/pay-success.component';
import { ScanPage } from './ui/scan/scan.page';
import { ReactiveFormsModule } from '@angular/forms';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

// import { Contacts } from '@ionic-native/contacts/ngx';

// the second parameter 'fr' is optional
registerLocaleData(localeZa, 'en-ZA');


@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        RegistrationPage,
        AboutPage,
        UserProfileComponent,
        ProfilePage,
        PayPage,
        PayAuthPage,
        RequestPayPage,
        RequestPayAuthPage,
        PinComponent,
        ZapcurrencyPipe,
        PaySuccessComponent,
        ScanPage,
    ],
    entryComponents: [

    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            backButtonText: ''
        }),
        AppRoutingModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        HttpClientModule,
        ReactiveFormsModule,
        AccountPageModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ServiceWorkerModule.register('firebase-messaging-sw.js', { enabled: environment.production }),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Firebase,
        PspService,
        AuthService,
        FcmService,
        QrcodeService,
        BarcodeScanner,
        // Contacts,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


