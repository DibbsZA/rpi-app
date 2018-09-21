import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PinConfirmPage } from './pin-confirm.page';

const routes: Routes = [
    {
        path: '',
        component: PinConfirmPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule
    ],
    declarations: [
        PinConfirmPage
    ]
})
export class PinConfirmPageModule { }
