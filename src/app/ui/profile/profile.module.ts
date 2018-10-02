import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';

import { HoldableDirective } from '../../core/holdable.directive';
import { CanDeactivateGuard } from '../../core/can-deactivate-guard';


const routes: Routes = [
    {
        path: '',
        component: ProfilePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    entryComponents: [
    ],
    declarations: [
        ProfilePage,
        HoldableDirective
    ],
    providers: [
        CanDeactivateGuard
    ]
})
export class ProfilePageModule { }
