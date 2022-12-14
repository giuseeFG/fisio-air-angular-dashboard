import {Component, HostBinding} from '@angular/core';
import {LoginService} from '../../../services/login/login.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AppConfig} from '../../../app.config';
// @ts-ignore
import {version} from '../../../../../package.json';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.template.html'
})
export class LoginComponent {
    @HostBinding('class') classes = 'auth-page app';

    public version: string = version;

    username: string = '';
    password: string = '';

    constructor(
        public loginService: LoginService,
        private route: ActivatedRoute,
        appConfig: AppConfig,
        private router: Router
    ) {
        const config: any = appConfig.getConfig();
        const creds = config.auth;
        this.username = creds.username;
        this.password = creds.password;
    }

    public async login() {
        const {username, password} = this;
        if (username && username.trim().length !== 0 && password && password.trim().length !== 0) {
            this.loginService.skipLogin = false;
            const loginData: any = await this.loginService.loginUser({username, password})
                .catch(err => {
                    this.loginService.errorMessage = 'Errore login';
                    return
                });
            this.loginService.isFetching = false;
            if (!loginData)
                return;
            this.loginService.skipLogin = false;
            if (!loginData) {
                this.router.navigate(['login']);
                localStorage.clear();
                return;
            }
            this.router.navigate(['/dashboard']);
        }
    }

    getEnvironment() {
        switch (environment.type) {
            case 'prod':
                return '';
            default:
                return '-' + environment.type;
        }
    }
}
