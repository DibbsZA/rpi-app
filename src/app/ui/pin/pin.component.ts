import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-pin',
    templateUrl: './pin.component.html',
    styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {


    @Input() pspUrl: string;
    @Input() pagetitle: String;

    pin: string = "";
    data: any;

    // @Output() change: EventEmitter<string> = new EventEmitter<string>();
    @Output() change: EventEmitter<any> = new EventEmitter<any>();

    constructor(

    ) {


    }

    ngOnInit() {
        this.data = {
            'pspUrl': this.pspUrl,
            'pin': this.pin
        }
    }


    emitEvent() {
        this.change.emit(this.data);
    }

    handleInput(pin: string) {
        if (pin === "clear") {
            this.pin = "";
            return;
        }

        this.pin += pin;
        this.data.pin = this.pin;

        if (this.pin.length === 6) {
            return this.emitEvent();
        }
        return;
    }

}
