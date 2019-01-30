import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CanDeactivateGuard } from './guards/can-deactivate-guard';
import { ProfilePage } from './ui/profile/profile.page';
import { RegistrationPage } from './ui/registration/registration.page';
import { HomePage } from './ui/home/home.page';
import { AboutPage } from './ui/about/about.page';
import { PayPage } from './ui/pay/pay.page';
import { PaySuccessComponent } from './ui/pay-success/pay-success.component';
import { SettingsPage } from './ui/settings/settings.page';
import { AccountEditComponent } from './ui/account-edit/account-edit.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage, canLoad: [] },
    { path: 'registration', component: RegistrationPage, canLoad: [] },
    { path: 'about', component: AboutPage, canLoad: [] },
    { path: 'profile', component: ProfilePage, canActivate: [AuthGuard] },
    { path: 'payment/pay', component: PayPage, canActivate: [AuthGuard] },
    { path: 'payment/success', component: PaySuccessComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsPage, canLoad: [] },
    { path: 'account', component: AccountEditComponent, canActivate: [AuthGuard] },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [
        CanDeactivateGuard
    ]
})
export class AppRoutingModule { }
