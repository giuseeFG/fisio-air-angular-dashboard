import {Component, OnInit} from '@angular/core';
import {UtilsService} from './services/utils/utils.service';
import {LoginService} from './services/login/login.service';
import moment from 'moment';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {User} from 'firebase';

@Component({
    selector: 'app-root',
    template: `
        <loader class="mLoader" *ngIf="utilsService.loaderActive"></loader>
        <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {
    constructor(
        public utilsService: UtilsService,
        private loginService: LoginService,
        private router: Router
    ) {
        moment.locale('it-IT');

        const user = localStorage.getItem('fisio_air_user');
        if (user) {
            this.loginService.user = JSON.parse(user);
            this.loginService.skipLogin = true;
        }

        firebase.auth().onAuthStateChanged(async (firebaseUser: User) => {
            console.log('firebaseUser', firebaseUser, this.loginService.skipLogin);
            if (firebaseUser && !this.loginService.skipLogin) {
                console.log('firebaseUser1');
                // const user: any = await this.loginService.getUser(firebaseUser.uid)
                if (!firebaseUser) {
                    localStorage.removeItem('fisio_air_user');
                    this.router.navigate(['login']);
                } else {
                    // this.router.navigate(['dashboard']);
                }
            }
            this.loginService.skipLogin = false;
            this.utilsService.loaderActive = false;
        });
    }

    async ngOnInit() {

    }
}
