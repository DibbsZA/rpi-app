import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TxnDetailPage } from './txn-detail.page';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { JsonPipe } from '@angular/common';


const routes: Routes = [
    {
        path: '',
        component: TxnDetailPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PrettyJsonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TxnDetailPage],
    providers: [
    ],
})
export class TxnDetailPageModule { }
