import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {UserService} from '../../../services/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';

@Component({
    selector: 'post-detail',
    templateUrl: './user-detail.template.html'
})
export class UserDetailComponent implements OnInit {
    currentUser;
    form: FormGroup;
    searchText;
    dataReceived = false;

    constructor(
        private fb: FormBuilder,
        public utilsService: UtilsService,
        public loginService: LoginService,
        public userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.route.params.subscribe(async params => {
            if (params?.id) {
                this.currentUser = await this.userService.getUser(params.id);
                console.log('currentUser', this.currentUser);
                if (!this.currentUser) {
                    this.utilsService.goBack();
                    return;
                }
                this.setForm();
            } else {
                this.utilsService.goBack();
            }
            this.dataReceived = true;
        });
    }

    async setForm() {
        this.form = this.fb.group({
            id: [this.currentUser?.id ? this.currentUser.id : null],
            first_name: [this.currentUser?.first_name ? this.currentUser.first_name : null, [Validators.required]],
            last_name: [this.currentUser?.last_name ? this.currentUser.last_name : null, [Validators.required]],
            email: [this.currentUser?.email ? this.currentUser.email : null, [Validators.required]],
        });
    }

    ngOnInit() {
    }

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.currentUser ? 'Aggiorna utente' : 'Crea utente',
                text: `Confermi di voler ${this.currentUser ? 'aggiornare' : 'creare'} l\'utente?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            this.form.controls['email'].patchValue(this.form.controls['email'].value.trim().toLowerCase());
            const data = {...this.form.value};
            delete data.role;
            let newUser;
            newUser = await this.userService.updateUser(data);
            if (!newUser) {
                this.utilsService.loaderActive = false;
                return;
            }
            this.currentUser = newUser;
            this.utilsService.loaderActive = false;
        });
    }

    isCurrentUser() {
        return this.currentUser.id === this.loginService.user.id;
    }
}
