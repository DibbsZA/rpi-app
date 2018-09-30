import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { PayrequestAuthPage } from './payrequest-auth/payrequest-auth.page';
import { PinComponent } from './pin/pin.component';
import { PayPage } from './pay/pay.page';
import { RequestPayPage } from './request-pay/request-pay.page';


const routes: Routes = [
    { path: 'payment/pay', component: PayPage },
    { path: 'payment/payrequestauth', component: PayrequestAuthPage },
    { path: 'payment/requestpay', component: RequestPayPage }
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
        PayrequestAuthPage,
        RequestPayPage,
        PinComponent
    ]
})
export class PaymentModule { }
