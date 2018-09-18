import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
// import { Observable, of, from } from 'rxjs';
// import { NgxErrorsModule } from '@ultimate/ngxerrors';

import { HomePage } from './home.page';
import { UserFormComponent } from '../user-form/user-form.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,

        // NgxErrorsModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ])
    ],
    declarations: [
        HomePage,
        UserFormComponent]
})
export class HomePageModule { }
