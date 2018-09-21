import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './ui/home/home.module#HomePageModule', canLoad: [] },
    // { path: 'list', loadChildren: './ui/list/list.module#ListPageModule', canActivate: [AuthGuard] },
    { path: 'scan', loadChildren: './ui/scan/scan.module#ScanPageModule', canActivate: [AuthGuard] },
    { path: 'pay', loadChildren: './ui/pay/pay.module#PayPageModule', canActivate: [AuthGuard] },
    { path: 'about', loadChildren: './ui/about/about.module#AboutPageModule' },
    { path: 'profile', loadChildren: './ui/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path: 'registration', loadChildren: './ui/registration/registration.module#RegistrationPageModule' },
    { path: 'account', loadChildren: './ui/account/account.module#AccountPageModule' },
  { path: 'history', loadChildren: './ui/history/history.module#HistoryPageModule' },
  { path: 'pin-confirm', loadChildren: './ui/pin-confirm/pin-confirm.module#PinConfirmPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
