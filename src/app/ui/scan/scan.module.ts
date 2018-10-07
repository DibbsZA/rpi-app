import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ScanPage } from './scan.page';

const routes: Routes = [
    {
        path: '',
        component: ScanPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ScanPage],
    providers: [
        BarcodeScanner
    ]
})
export class ScanPageModule { }
