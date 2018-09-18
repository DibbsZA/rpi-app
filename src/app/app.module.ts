import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from "./config";

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { UserFormComponent } from './ui/user-form/user-form.component';
import { UserProfileComponent } from './ui/user-profile/user-profile.component';

import { ProfilePageModule } from './ui/profile/profile.module';
import { ScanPageModule } from './ui/scan/scan.module';
import { PayPageModule } from './ui/pay/pay.module';
import { PspSvcService } from './core/psp-svc.service';
import { AuthSvcService } from './core/auth-svc.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        UserProfileComponent,
    ],
    entryComponents: [

    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig),
        AppRoutingModule,
        AngularFireModule,
        AngularFirestoreModule,
        AngularFireAuthModule,
        ProfilePageModule,
        ScanPageModule,
        PayPageModule,
        FormsModule,
        ReactiveFormsModule
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
