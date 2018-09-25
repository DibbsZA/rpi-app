import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PayrequestAuthPage } from './payrequest-auth.page';

const routes: Routes = [
  {
    path: '',
    component: PayrequestAuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PayrequestAuthPage]
})
export class PayrequestAuthPageModule {}
