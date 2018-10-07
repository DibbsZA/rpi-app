import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PayAuthPage } from './pay-auth/pay-auth.page';
import { PinComponent } from './pin/pin.component';
import { PayPage } from './pay/pay.page';
import { RequestPayPage } from './request-pay/request-pay.page';
import { RequestPayAuthPage } from './request-pay-auth/request-pay-auth.page';
import { ZapcurrencyPipe } from '../core/zapcurrency.pipe';
import { PaySuccessComponent } from './pay-success/pay-success.component';
import { AuthGuard } from '../core/auth.guard';
import { FcmHandlerComponent } from './fcm-handler/fcm-handler.component';


const routes: Routes = [
    { path: 'payment/pay', component: PayPage, canActivate: [AuthGuard] },
    { path: 'payment/payauth', component: PayAuthPage, canActivate: [AuthGuard] },
    { path: 'payment/success', component: PaySuccessComponent, canActivate: [AuthGuard] },
    { path: 'payment/requestpay', component: RequestPayPage, canActivate: [AuthGuard] },
    { path: 'payment/requestpayauth', component: RequestPayAuthPage, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        PayPage,
        PayAuthPage,
        RequestPayPage,
        RequestPayAuthPage,
        PinComponent,
        ZapcurrencyPipe,
        PaySuccessComponent,
        // FcmHandlerComponent
    ]
})
export class PaymentModule { }
