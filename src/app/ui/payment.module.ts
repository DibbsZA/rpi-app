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


const routes: Routes = [
    { path: 'payment/pay', component: PayPage },
    { path: 'payment/payauth', component: PayAuthPage },
    { path: 'payment/success', component: PaySuccessComponent },
    { path: 'payment/requestpay', component: RequestPayPage },
    { path: 'payment/requestpayauth', component: RequestPayAuthPage }
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
        PaySuccessComponent
    ]
})
export class PaymentModule { }
