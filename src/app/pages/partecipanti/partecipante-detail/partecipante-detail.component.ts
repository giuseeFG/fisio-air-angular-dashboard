import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {PartecipantiService} from '../../../services/partecipanti/partecipanti.service';

@Component({
    selector: 'partecipante-detail',
    templateUrl: './partecipante-detail.template.html'
})
export class PartecipanteDetailComponent implements OnInit {
    currentPartecipante;
    form: FormGroup;
    dataReceived = false;

    constructor(
        private fb: FormBuilder,
        public utilsService: UtilsService,
        public loginService: LoginService,
        public partecipantiService: PartecipantiService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
    ) {
        this.route.params.subscribe(async params => {
            if (params?.id) {
                const data: any = await this.partecipantiService.getPartecipante(params.id);
                if (data.fisio_partecipanti?.length) {
                    this.currentPartecipante = data.fisio_partecipanti[0];
                }
                console.log('currentPartecipante', this.currentPartecipante);
                if (!this.currentPartecipante) {
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
            id: [this.currentPartecipante?.id],
            cod_fisc: [this.currentPartecipante?.cod_fisc],
            nome: [this.currentPartecipante?.nome],
            cognome: [this.currentPartecipante?.cognome],
            disciplina: [this.currentPartecipante?.disciplina],
            libprof_dip: [this.currentPartecipante?.libprof_dip],
            professione: [this.currentPartecipante?.professione],
        });
    }

    ngOnInit() {
    }

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.currentPartecipante ? 'Aggiorna partecipante' : 'Crea partecipante',
                text: `Confermi di voler ${this.currentPartecipante ? 'aggiornare' : 'creare'} il partecipante?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            this.form.controls['email'].patchValue(this.form.controls['email'].value.trim().toLowerCase());
            const data = {...this.form.value};
            delete data.role;
            let newUser;
            newUser = await this.partecipantiService.updatePartecipante(data);
            if (!newUser) {
                this.utilsService.loaderActive = false;
                return;
            }
            this.currentPartecipante = newUser;
            this.utilsService.loaderActive = false;
        });
    }

    isCurrentUser() {
        return this.currentPartecipante.id === this.loginService.user.id;
    }
}
