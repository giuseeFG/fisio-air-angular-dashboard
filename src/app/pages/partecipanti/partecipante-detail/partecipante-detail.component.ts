import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {PartecipantiService} from '../../../services/partecipanti/partecipanti.service';
import {ProfessioniService} from '../../../services/professioni/professioni.service';
import {DisciplineService} from '../../../services/discipline/discipline.service';

@Component({
    selector: 'partecipante-detail',
    templateUrl: './partecipante-detail.template.html'
})
export class PartecipanteDetailComponent implements OnInit {
    form: FormGroup;
    dataReceived = false;
    currentPartecipante;
    discipline;
    professioni;

    constructor(
        private fb: FormBuilder,
        public utilsService: UtilsService,
        public loginService: LoginService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private partecipantiService: PartecipantiService,
        private professioniService: ProfessioniService,
        private disciplineService: DisciplineService
    ) {
        this.route.params.subscribe(async params => {
            let currentPartecipante;
            const discData: any = await this.disciplineService.getDiscipline();
            this.discipline = discData.fisio_discipline;
            const profData: any = await this.professioniService.getProfessioni();
            this.professioni = profData.fisio_professioni;
            if (params?.id) {
                const data: any = await this.partecipantiService.getPartecipante(params.id);
                if (data?.fisio_partecipanti) {
                    currentPartecipante = data?.fisio_partecipanti[0];
                    this.currentPartecipante = currentPartecipante;
                    if (!currentPartecipante) {
                        this.utilsService.goBack();
                        return;
                    }
                }
            }
            this.setForm(currentPartecipante);
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

            let res1: any;
            if (this.currentPartecipante) {
                res1 = await this.partecipantiService.updatePartecipante(this.form.value);
            } else {
                const data = {...this.form.value};
                delete data.id;
                res1 = await this.partecipantiService.insertPartecipante(data);
            }
            this.utilsService.loaderActive = false;
            console.log(res1);
            if (res1.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.update_fisio_partecipanti?.affected_rows === 0) {
                this.utilsService.showError();
                return;
            }
            this.utilsService.goBack();
        });
    }
}
