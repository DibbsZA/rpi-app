import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PspSvcService {

    constructor(
        public httpClnt: HttpClient,

    ) {

    }
}
