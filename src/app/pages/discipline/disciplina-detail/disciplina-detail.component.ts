import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {GraphQLService} from '../../../services/graphQL/graphQL.service';

@Component({
    selector: 'disciplina-detail',
    templateUrl: './disciplina-detail.template.html'
})
export class DisciplinaDetailComponent implements OnInit {
    form: FormGroup;
    dataReceived = false;
    currentDisciplina;

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
            let currentDisciplina;
            if (params?.codice) {
                const data: any = await this.graphQLService.getDisciplina(params.codice);
                if (data?.fisio_discipline) {
                    currentDisciplina = data?.fisio_discipline[0];
                    this.currentDisciplina = currentDisciplina;
                    console.log('currentDisciplina', this.currentDisciplina);
                    if (!currentDisciplina) {
                        this.utilsService.goBack();
                        return;
                    }
                }
            }
            this.setForm(currentDisciplina);
            this.dataReceived = true;
        });
    }

    async setForm(currentDisciplina) {
        this.form = this.fb.group({
            codice: [currentDisciplina?.codice],
            professione: [currentDisciplina?.professione],
            disciplina: [currentDisciplina?.disciplina],
        });
    }

    ngOnInit() {
    }

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.form.value.id ? 'Aggiorna disciplina' : 'Crea disciplina',
                text: `Confermi di voler ${this.form.value.id ? 'aggiornare' : 'creare'} la disciplina?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            let res1: any;
            if (this.currentDisciplina) {
                res1 = await this.graphQLService.updateDisciplina(this.form.value.codice, this.form.value);
            } else {
                res1 = await this.graphQLService.insertDisciplina(this.form.value);
            }
            this.utilsService.loaderActive = false;
            console.log(res1);
            if (res1.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.update_fisio_discipline?.affected_rows === 0) {
                this.utilsService.showError();
                return;
            }
            this.utilsService.goBack();
        });
    }
}
