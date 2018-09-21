import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-pin-confirm',
    templateUrl: './pin-confirm.page.html',
    styleUrls: ['./pin-confirm.page.scss'],
})
export class PinConfirmPage implements OnInit {

    myForm: FormGroup;

    constructor(
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.myForm = this.fb.group({
            email: '',
            message: '',
            career: ''
        })

        this.myForm.valueChanges.subscribe(console.log)
    }
}
