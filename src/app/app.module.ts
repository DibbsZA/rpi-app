import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

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

import { ProfilePageModule } from './ui/profile/profile.module';
import { PspSvcService } from './core/psp-svc.service';
import { AuthSvcService } from './core/auth-svc.service';
import { AccountPageModule } from './ui/account/account.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { PaymentModule } from './ui/payment.module';

import { registerLocaleData } from '@angular/common';
import localeZa from '@angular/common/locales/en-ZA';
import { FcmService } from './core/fcm.service';
// import { ZapcurrencyPipe } from './core/zapcurrency.pipe';
// import { FcmHandlerComponent } from './ui/fcm-handler/fcm-handler.component';

// the second parameter 'fr' is optional
registerLocaleData(localeZa, 'en-ZA');


@NgModule({
    declarations: [
        AppComponent,
        UserProfileComponent,
        // FcmHandlerComponent,
        // ZapcurrencyPipe,
        // HoldableDirective,
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
        ProfilePageModule,
        PaymentModule,
        AccountPageModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ServiceWorkerModule.register('firebase-messaging-sw.js', { enabled: environment.production }),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Firebase,
        PspSvcService,
        AuthSvcService,
        FcmService
    ],
    // exports: [
    //     ZapcurrencyPipe
    // ],
    bootstrap: [AppComponent]
})
export class AppModule { }


