import { Component, OnInit } from '@angular/core';
import { FcmService } from '../../core/fcm.service';
import { NotifyService } from '../../core/notify.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'fcm-handler',
    templateUrl: './fcm-handler.component.html',
    styleUrls: ['./fcm-handler.component.scss']
})
export class FcmHandlerComponent implements OnInit {

    constructor(
        private fcm: FcmService,
        private notify: NotifyService,
    ) {

    }

    ngOnInit() {
        this.fcm.getToken();
        this.fcm.monitorTokenRefresh().subscribe();
        this.fcm.receiveMessages()
            .subscribe(
                x => {
                    // let data: msgPSPPayment = payload.data;
                    // data.click_action = payload.notification.click_action;
                    // data.msg_type = payload.data.msgtype;
                    this.notify.update(JSON.stringify(x), 'action');
                },
                err => {

                }
            );
    }

    onClick() {
        this.fcm.getToken()
            .then(x => {

                this.fcm.receiveMessages();
                this.notify.update('Token updated <br>', 'note');
            });
    }

}
