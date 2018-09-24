import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'home', loadChildren: './ui/home/home.module#HomePageModule', canLoad: [] },
    { path: 'registration', loadChildren: './ui/registration/registration.module#RegistrationPageModule' },
    { path: 'scan', loadChildren: './ui/scan/scan.module#ScanPageModule', canActivate: [AuthGuard] },
    { path: 'pay', loadChildren: './ui/pay/pay.module#PayPageModule', canActivate: [AuthGuard] },
    { path: 'about', loadChildren: './ui/about/about.module#AboutPageModule' },
    { path: 'profile', loadChildren: './ui/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path: 'account', loadChildren: './ui/account/account.module#AccountPageModule', canActivate: [AuthGuard] },
    { path: 'history', loadChildren: './ui/history/history.module#HistoryPageModule', canActivate: [AuthGuard] },
    { path: 'pin-confirm', loadChildren: './ui/pin-confirm/pin-confirm.module#PinConfirmPageModule', canActivate: [AuthGuard] },
    { path: 'txn-detail/:id', loadChildren: './ui/txn-detail/txn-detail.module#TxnDetailPageModule', canActivate: [AuthGuard] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
