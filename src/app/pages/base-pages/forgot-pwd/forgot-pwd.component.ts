import {Component, HostBinding} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../services/utils/utils.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../../services/login/login.service';

@Component({
    selector: 'forgot-pwd',
    templateUrl: './forgot-pwd.template.html',
})
export class ForgotPwdComponent {
    @HostBinding('class') classes = 'auth-page app';
    form: FormGroup;
    isFetching = false;

    constructor(
        private utilsService: UtilsService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private loginService: LoginService
    ) {
        this.form = fb.group({
            email: [null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$')]]
        });
    }

    async restore() {
        this.isFetching = true;
        this.utilsService.loaderActive = true;
        await this.loginService.forgotPwd(this.form.value['email'], 'https://dashboard.yougo.nxtcloud.it/#/reset-pwd')
            .then(res => {
                this.utilsService.showMessage(
                    'Ti abbiamo inviato una mail con la quale resettare la password',
                    'Controlla la tua casella di posta'
                );
                this.utilsService.goBack();
            })
            .catch(err => {
                this.utilsService.showError('C\'è stato un errore durante il reset della password.');
            });
        this.utilsService.loaderActive = false;
        this.isFetching = false;
    }
}
