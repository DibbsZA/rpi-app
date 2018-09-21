import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-pin',
    templateUrl: './pin.component.html',
    styleUrls: ['./pin.component.scss']
})
export class PinComponent implements OnInit {

    ngOnInit() {
    }
    @Input() pagetitle: String = "Enter Pin";

    pin: string = "";

    @Output() change: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    emitEvent() {
        this.change.emit(this.pin);
    }

    handleInput(pin: string) {
        if (pin === "clear") {
            this.pin = "";
            return;
        }

        if (this.pin.length === 6) {
            return;
        }
        this.pin += pin;
    }

}
