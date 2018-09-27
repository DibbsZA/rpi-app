import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-payrequest-auth',
    templateUrl: './payrequest-auth.page.html',
    styleUrls: ['./payrequest-auth.page.scss'],
})
export class PayrequestAuthPage implements OnInit {

    fcmPayload: any;

    constructor(
        private activeRoute: ActivatedRoute,
    ) {

    }

    ngOnInit() {

        this.activeRoute.queryParams.subscribe(queryParams => {
            if (queryParams.msg !== undefined) {
                let msg: string = queryParams.msg;
                if (msg.startsWith('%')) {
                    msg = decodeURIComponent(msg);
                    this.fcmPayload = JSON.parse(msg);
                } else {

                    this.fcmPayload = JSON.parse(queryParams.msg);
                }
                console.log(this.fcmPayload);
            }
        });

    }

}
