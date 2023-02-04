import {Component, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../services/utils/utils.service';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

@Component({
    selector: 'change-pwd',
    templateUrl: './change-pwd.template.html',
    styleUrls: ['./change-pwd.component.scss']
})
export class ChangePwdComponent {
    form: FormGroup;
    isFetching = false;
    eventYes: EventEmitter<any> = new EventEmitter();
    hidden = true;
    hidden1 = true;
    hidden2 = true;

    constructor(
        public utilsService: UtilsService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private modalService: BsModalService,
        public modalRef: BsModalRef
    ) {
        this.form = fb.group({
            currentPassword: [null, [Validators.required, Validators.minLength(6)]],
            newPassword: [null, [Validators.required, Validators.minLength(6)]],
            confirmation: [null, [Validators.required, Validators.minLength(6)]],
        }, {validators: this.checkPasswords});
    }

    checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
        const pass = group.get('newPassword').value;
        if ((pass + '').length < 6) {
            return;
        }
        const confirmPass = group.get('confirmation').value;
        if ((confirmPass + '').length < 6) {
            return;
        }
        if (group.get('confirmation').dirty && group.get('newPassword').dirty) {
            return pass === confirmPass ? null : {notSame: true};
        }
    };

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: 'Modifica password',
                text: 'Confermi di voler modificare la tua password?'
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;
            // this.userService.changePassword(this.form.value)
            //     .then(res1 => {
            //         this.hide();
            //         this.eventYes.emit({result: true});
            //         this.utilsService.showSwalMessage('Password modificata', 'La password è stata correttamente modificata');
            //         return true;
            //     })
            //     .catch(err => {
            //         this.utilsService.showSwalMessage('Errore', 'C\'è stato un errore durante la modifica della password', 'error');
            //         return true;
            //     });
        });
    }

    hide() {
        this.modalRef.hide();
    }
}
