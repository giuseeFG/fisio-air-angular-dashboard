import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {UtilsService} from '../../../services/utils/utils.service';

@Component({
    selector: 'app-reset-pwd',
    templateUrl: './reset-pwd.component.html',
    styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {
    public form: FormGroup;
    toShowLoader = true;
    code;
    email;
    hide = true;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private loginService: LoginService,
        private utilsService: UtilsService
    ) {
        this.form = fb.group({
            password: ['', [Validators.required]],
            email: ['', [Validators.required]],
            repeat_password: ['', Validators.required]
        });
        this.route.params.subscribe(async params => {
        });
        const code = this.route.snapshot.queryParamMap.get('code');
        console.log(code);
        this.code = code;
    }

    ngOnInit() {
    }

    async done(form) {
        const res = await this.loginService.resetPwd({
            code: this.code,
            email: form.value.email,
            password: form.value.password
        }).catch(err => {
            if (err.status === 500) {
                this.utilsService.showError('Codice scaduto');
            } else {
                this.utilsService.showError('Email errata');
            }
            return false;
        });
        if (!res) {
            return;
        }
        this.form.reset();
        alert('La password è stata correttamente modificata.');
        this.router.navigateByUrl('/login');
        // if (this.router.url.startsWith('/reset-pwd-app')) {
        //     this.form.reset();
        //     alert('La password è stata correttamente modificata.');
        //     // this.utilsService.showMessage('Puoi fare accesso dall\'app mobile', 'La password è stata correttamente modificata.', 10000);
        // } else {
        //     this.router.navigateByUrl('/login');
        // }
    }
}
