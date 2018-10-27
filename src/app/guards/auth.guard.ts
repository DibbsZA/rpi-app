import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/interfaces.0.2';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    user: Observable<UserProfile | null>;
    // loggedIn: boolean = true;

    constructor(
        public auth: AuthService,
        private router: Router
    ) {
        this.user = this.auth.user;
    }


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {

        let loggedIn = true;
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
