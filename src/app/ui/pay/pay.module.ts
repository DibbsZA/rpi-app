import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PayPage } from './pay.page';
import { PinComponent } from '../pin/pin.component';

const routes: Routes = [
    {
        path: '',
        component: PayPage
    }
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
        PinComponent
    ]
})
export class PayPageModule { }
