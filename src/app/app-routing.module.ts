import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { ProfilePage } from './ui/profile/profile.page';
import { RegistrationPage } from './ui/registration/registration.page';
import { HomePage } from './ui/home/home.page';
import { AboutPage } from './ui/about/about.page';
import { PayPage } from './ui/pay/pay.page';
import { PayAuthPage } from './ui/pay-auth/pay-auth.page';
import { PaySuccessComponent } from './ui/pay-success/pay-success.component';
import { RequestPayPage } from './ui/request-pay/request-pay.page';
import { RequestPayAuthPage } from './ui/request-pay-auth/request-pay-auth.page';
import { ScanPage } from './ui/scan/scan.page';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage, canLoad: [] },
    { path: 'registration', component: RegistrationPage, canLoad: [] },
    { path: 'about', component: AboutPage, canLoad: [] },
    { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: './ui/account/account.module#AccountPageModule', canActivate: [AuthGuard] },
    // { path: 'payment', loadChildren: './ui/payment.module#PaymentModule', canActivate: [AuthGuard] }
    { path: 'payment/pay', component: PayPage, canActivate: [AuthGuard] },
    { path: 'payment/payauth', component: PayAuthPage, canActivate: [AuthGuard] },
    { path: 'payment/success', component: PaySuccessComponent, canActivate: [AuthGuard] },
    { path: 'payment/requestpay', component: RequestPayPage, canActivate: [AuthGuard] },
    { path: 'payment/requestpayauth', component: RequestPayAuthPage, canActivate: [AuthGuard] },
    { path: 'payment/scan', component: ScanPage, canActivate: [AuthGuard] }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        CanDeactivateGuard
    ]
})
export class AppRoutingModule { }
