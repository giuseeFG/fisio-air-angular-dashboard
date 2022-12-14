import {AppConfig} from '../../app.config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import firebase from "firebase";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    config: any;
    _isFetching: boolean = false;
    _errorMessage: string = '';
    user;
    token;
    skipLogin = false;

    constructor(
        private appConfig: AppConfig,
        private httpClient: HttpClient,
        private router: Router,
    ) {
        this.config = appConfig.getConfig();
    }

    get isFetching() {
        return this._isFetching;
    }

    set isFetching(val: boolean) {
        this._isFetching = val;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(val: string) {
        this._errorMessage = val;
    }

    async loginUser(creds) {
        this.isFetching = true;
        this.errorMessage = null;
        if (creds?.username?.length && creds?.password?.length) {
            this.skipLogin = true;
            return firebase.auth().signInWithEmailAndPassword(creds.username, creds.password)
                .then(async (res: any) => {
                    console.log('ecco');
                    this.router.navigate(['dashboard']);
                    return res;
                    // return await this.getUser(res.user.uid);
                });
        } else {
            this.loginError('C\'è stato un errore durante il login.');
        }
        return null;
    }

    logoutUser() {
        firebase.auth().signOut();
        this.token = null;
        localStorage.clear();
        document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.router.navigate(['/login']);
    }

    loginError(payload) {
        this.isFetching = false;
        this.errorMessage = payload;
    }

    async proceedLogin(resLogin) {
        this.isFetching = false;
        this.errorMessage = '';
        return resLogin;
    }

    async forgotPwd(email, redirect_url) {
        return await this.httpClient.post(environment.basePath + '/forgot', {
            email: email.trim(),
            reset_link: redirect_url
        }).toPromise();
    }

    async resetPwd(params) {
        return await this.httpClient.post(environment.basePath + '/reset', params).toPromise();
    }

    async getUser(uid) {
        return await this.httpClient.get(environment.basePath + `/users?firebaseId=eq.${uid}`, {
            headers: {
                "Accept": "application/vnd.pgrst.object+json",
                Prefer: 'return=representation',
            }
        }).toPromise()
            .then(res => {
                this.user = res;
                localStorage.setItem('fisio_air_user', JSON.stringify(res));
                return res;
            });
    }
}
