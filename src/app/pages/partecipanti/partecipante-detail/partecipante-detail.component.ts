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
    form: FormGroup;
    dataReceived = false;
    currentPartecipante;

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
                    const currentPartecipante = data.fisio_partecipanti[0];
                    this.currentPartecipante = currentPartecipante;
                    if (!currentPartecipante) {
                        this.utilsService.goBack();
                        return;
                    }
                    this.setForm(currentPartecipante);
                }
            } else {
                this.utilsService.goBack();
            }
            this.dataReceived = true;
        });
    }

    async setForm(currentPartecipante) {
        this.form = this.fb.group({
            id: [currentPartecipante?.id],
            cod_fisc: [currentPartecipante?.cod_fisc],
            nome: [currentPartecipante?.nome],
            cognome: [currentPartecipante?.cognome],
            disciplina: [currentPartecipante?.disciplina],
            libprof_dip: [currentPartecipante?.libprof_dip],
            professione: [currentPartecipante?.professione],
        });
    }

    ngOnInit() {
    }

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.form.value.id ? 'Aggiorna partecipante' : 'Crea partecipante',
                text: `Confermi di voler ${this.form.value.id ? 'aggiornare' : 'creare'} il partecipante?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            const data = {...this.form.value};
            let newUser;
            newUser = await this.partecipantiService.updatePartecipante(data);
            if (!newUser) {
                this.utilsService.loaderActive = false;
                return;
            }
            this.utilsService.goBack();
            this.utilsService.loaderActive = false;
        });
    }
}
