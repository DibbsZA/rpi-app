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
import { PaySuccessComponent } from './pay-success/pay-success.component';
import { ScanPage } from './scan/scan.page';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthGuard } from '../guards/auth.guard';
import { ZapcurrencyPipe } from '../pipes/zapcurrency.pipe';
import { TxnDetailComponent } from './txn-detail/txn-detail.component';


const routes: Routes = [
    { path: 'payment/pay', component: PayPage, canActivate: [AuthGuard] },
    { path: 'payment/payauth', component: PayAuthPage, canActivate: [AuthGuard] },
    { path: 'payment/success', component: PaySuccessComponent, canActivate: [AuthGuard] },
    { path: 'payment/requestpay', component: RequestPayPage, canActivate: [AuthGuard] },
    { path: 'payment/requestpayauth', component: RequestPayAuthPage, canActivate: [AuthGuard] },
    { path: 'payment/scan', component: ScanPage, canActivate: [AuthGuard] }
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
        ScanPage,
        TxnDetailComponent
    ],
    providers: [
        BarcodeScanner
    ]
})
export class PaymentModule { }
