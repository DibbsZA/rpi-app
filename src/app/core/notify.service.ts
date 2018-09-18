import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

/// Notify users about errors and other helpful stuff
export interface Msg {
    content: string;
    style: string;
}


@Injectable({
    providedIn: 'root'
})
export class NotifyService {

    private _msgSource = new Subject<Msg | null>();

    msg = this._msgSource.asObservable();

    update(content: string, style: 'error' | 'info' | 'success') {
        const msg: Msg = { content, style };
        this._msgSource.next(msg);
        console.log(msg)
    }

    clear() {
        this._msgSource.next(null);
    }
}
