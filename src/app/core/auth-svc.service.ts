import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { NotifyService } from './notify.service';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter, first } from 'rxjs/operators';

import { iUser } from '../models/interfaces';
import { UserServiceService } from './user-service.service';

@Injectable({
   providedIn: 'root'
})
export class AuthSvcService {
   user: Observable<iUser>;

   constructor(
      private afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router,
      private notify: NotifyService,
      private userSvc: UserServiceService

   ) {
      this.user = this.afAuth.authState.pipe(
         switchMap(user => {
            if (user) {
               return this.afs.doc<iUser>(`users/${user.uid}`).valueChanges();
            } else {
               return of(null);
            }
         })
      );

   }

   async getCurrentUser(): Promise<any> {
      return this.user.pipe(first()).toPromise();
   }

   //// Email/Password Auth ////
   async emailSignUp(email: string, password: string) {
      return this.afAuth.auth
         .createUserWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
         .then(credential => {
            this.notify.update('<b>Hey there, welcome to Z@P!</b> <br><br>Please remember to update your Profile.', 'note');
            const newUser: iUser = {
               uid: credential.user.uid,
               email: credential.user.email,
               accounts: []
            };

            console.log('New User: ' + JSON.stringify(newUser));
            return this.userSvc.updateUserData(newUser);
         })
         .catch(error => this.handleError(error));
   }

   async emailLogin(email: string, password: string) {
      return this.afAuth.auth
         .signInWithEmailAndPassword(email.toLowerCase().trim(), password.trim())
         .then(credential => {
            this.notify.update('Welcome back to Z@P!', 'success');
            return credential;
            // this.updateUserData(credential.user);
            // .then(r => {
            //     console.log(r);
            //     return credential.user;
            // });
            // return this.userSvc.getUserData(credential.user.uid);
         })
         .catch(error => this.handleError(error));
   }

   // Sends email allowing user to reset password
   resetPassword(email: string) {
      const fbAuth = auth();

      return fbAuth
         .sendPasswordResetEmail(email)
         .then(() => this.notify.update('Password update email sent', 'info'))
         .catch(error => this.handleError(error));
   }

   signOut() {
      this.afAuth.auth.signOut().then(() => {
         this.user = null;
         this.router.navigate(['/about']);
      });
   }

   // If error, console log and notify user
   private handleError(error: Error) {
      console.error(error);
      this.notify.update(error.message, 'error');
   }

}
