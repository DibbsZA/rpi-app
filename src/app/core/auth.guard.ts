import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { iUser } from '../models/interfaces';
import { AuthSvcService } from './auth-svc.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    user: Observable<iUser | null>;
    // loggedIn: boolean = true;

    constructor(
        public auth: AuthSvcService,
        private router: Router
    ) {
        this.user = this.auth.user;
    }


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        var loggedIn = true;

        this.user.subscribe(
            x => {

                if (x == null) {
                    loggedIn = false;
                    this.router.navigate(['/']);
                }
            },
            e => {
                console.error(e);
            });
        if (!this.user) {
            loggedIn = false;
        }
        return loggedIn;
    }
}
