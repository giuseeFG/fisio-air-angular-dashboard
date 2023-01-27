import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {GraphQLService} from '../../../services/graphQL/graphQL.service';

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
        private graphQLService: GraphQLService
    ) {
        this.route.params.subscribe(async params => {
            let currentPartecipante;
            const discData: any = await this.graphQLService.getAllGraphQL('fisio_discipline', 'codice professione', 'professione', 'asc');
            this.discipline = discData.data.fisio_discipline;
            const profData: any = await this.graphQLService.getAllGraphQL('fisio_professioni', 'codice professione', 'professione', 'asc');
            this.professioni = profData.data.fisio_professioni;
            if (params?.id) {
                const data: any = await this.graphQLService.getSpecificGraphQL('fisio_partecipanti',
                    'id cod_fisc cognome created_at disciplina libprof_dip nome professione',
                    'id',
                    params.id,
                    'Int'
                );
                if (data?.data?.fisio_partecipanti) {
                    currentPartecipante = data?.data?.fisio_partecipanti[0];
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
                const data = {...this.form.value};
                res1 = await this.graphQLService.mutationUpdateGraphQL(
                    'update_fisio_partecipanti',
                    'fisio_partecipanti_set_input',
                    data,
                    'id',
                    this.form.value.id,
                    'Int');
            } else {
                const data = {...this.form.value};
                delete data.id;
                res1 = this.graphQLService.mutationInsertGraphQL(
                    'insert_fisio_partecipanti',
                    'fisio_partecipanti_insert_input',
                    data);
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
