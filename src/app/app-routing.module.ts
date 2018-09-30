import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './ui/home/home.module#HomePageModule', canLoad: [] },
    { path: 'registration', loadChildren: './ui/registration/registration.module#RegistrationPageModule', canLoad: [] },
    { path: 'scan', loadChildren: './ui/scan/scan.module#ScanPageModule', canActivate: [AuthGuard] },
    { path: 'pay', loadChildren: './ui/pay/pay.module#PayPageModule', canActivate: [AuthGuard] },
    { path: 'about', loadChildren: './ui/about/about.module#AboutPageModule', canLoad: [] },
    { path: 'profile', loadChildren: './ui/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path: 'account', loadChildren: './ui/account/account.module#AccountPageModule', canActivate: [AuthGuard] },
    { path: 'history', loadChildren: './ui/history/history.module#HistoryPageModule', canActivate: [AuthGuard] },
    { path: 'txn-detail/:id', loadChildren: './ui/txn-detail/txn-detail.module#TxnDetailPageModule', canActivate: [AuthGuard] },
    { path: 'payrequestAuth', loadChildren: './ui/payrequest-auth/payrequest-auth.module#PayrequestAuthPageModule', canActivate: [AuthGuard] },
    { path: 'requestpay', loadChildren: './ui/request-pay/request-pay.module#RequestPayPageModule', canActivate: [AuthGuard] },
    { path: 'show-qr', loadChildren: './ui/show-qr/show-qr.module#ShowQrPageModule', canActivate: [AuthGuard] }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
