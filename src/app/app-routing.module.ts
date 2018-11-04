import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadChildren: './ui/home/home.module#HomePageModule', canLoad: [] },
    { path: 'registration', loadChildren: './ui/registration/registration.module#RegistrationPageModule', canLoad: [] },
    { path: 'about', loadChildren: './ui/about/about.module#AboutPageModule', canLoad: [] },
    { path: 'profile', loadChildren: './ui/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
    { path: 'account', loadChildren: './ui/account/account.module#AccountPageModule', canActivate: [AuthGuard] },
    { path: 'history', loadChildren: './ui/history/history.module#HistoryPageModule', canActivate: [AuthGuard] },
    { path: 'payment', loadChildren: './ui/payment.module#PaymentModule', canActivate: [AuthGuard] }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        CanDeactivateGuard
    ]
})
export class AppRoutingModule { }
