import { Component, OnInit } from '@angular/core';
import { FcmService } from '../../core/fcm.service';
import { NotifyService } from '../../core/notify.service';
import { tap } from 'rxjs/operators';
import { msgPSPPayment } from '../../models/messages';
import { Subject } from 'rxjs';

@Component({
    selector: 'fcm-handler',
    templateUrl: './fcm-handler.component.html',
    styleUrls: ['./fcm-handler.component.scss']
})
export class FcmHandlerComponent implements OnInit {

    private messageSource = new Subject();
    currentMessage = this.messageSource.asObservable();

    constructor(
        private fcm: FcmService,
        private notify: NotifyService,
    ) {

    }

    ngOnInit() {
        this.fcm.getToken();
        this.fcm.monitorTokenRefresh().subscribe();
        this.fcm.listenToNotifications().pipe(
            tap(msg => {
                if (msg === null) {
                    return;
                }
                this.notify.update(JSON.stringify(msg), 'note');
                // tslint:disable-next-line:prefer-const
                let data: msgPSPPayment = msg.data;
                data.click_action = msg.notification.click_action;
                data.msg_type = msg.data.msgtype;

                console.log('Message received. ', msg);
                this.notify.update(data, 'action');
                this.messageSource.next(msg);

            })
        )
            .subscribe();
    }

    onClick() {
        this.fcm.getToken()
            .then(x => {
                const token = this.fcm.firebaseNative.getToken();
                this.notify.update('Token updated <br>' + JSON.stringify(token), 'note');
            });
    }
}
