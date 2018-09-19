import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account.page';
import { AccountEditComponent } from '../account-edit/account-edit.component';

const routes: Routes = [
    {
        path: '',
        component: AccountPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AccountPage,
        AccountEditComponent
    ]
})
export class AccountPageModule { }
