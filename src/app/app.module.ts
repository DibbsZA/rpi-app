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

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { ProfilePageModule } from './ui/profile/profile.module';
import { ScanPageModule } from './ui/scan/scan.module';
import { PayPageModule } from './ui/pay/pay.module';
import { PspSvcService } from './core/psp-svc.service';
import { AuthSvcService } from './core/auth-svc.service';
import { AccountPageModule } from './ui/account/account.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
// import { HoldableDirective } from './core/holdable.directive';

@NgModule({
    declarations: [
        AppComponent,
        UserProfileComponent,
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
        ScanPageModule,
        PayPageModule,
        AccountPageModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        // ServiceWorkerModule.register('firebase-messaging-sw.js', { enabled: environment.production }),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        PspSvcService,
        AuthSvcService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }


