import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {GraphQLService} from '../../../services/graphQL/graphQL.service';

@Component({
    selector: 'professione-detail',
    templateUrl: './professione-detail.template.html'
})
export class ProfessioneDetailComponent implements OnInit {
    form: FormGroup;
    dataReceived = false;
    currentProfessione;

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
            let currentProfessione;
            if (params?.codice) {
                const data: any = await this.graphQLService.getSpecificGraphQL('fisio_professioni',
                    'codice professione',
                    'codice',
                    params.codice,
                    'Int'
                );
                if (data?.data?.fisio_professioni) {
                    currentProfessione = data?.data?.fisio_professioni[0];
                    this.currentProfessione = currentProfessione;
                    console.log('currentProfessione', this.currentProfessione);
                    if (!currentProfessione) {
                        this.utilsService.goBack();
                        return;
                    }
                }
            }
            this.setForm(currentProfessione);
            this.dataReceived = true;
        });
    }

    async setForm(currentProfessione) {
        this.form = this.fb.group({
            codice: [currentProfessione?.codice],
            professione: [currentProfessione?.professione],
        });
    }

    ngOnInit() {
    }

    save() {
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.form.value.id ? 'Aggiorna professione' : 'Crea professione',
                text: `Confermi di voler ${this.form.value.id ? 'aggiornare' : 'creare'} la professione?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            let res1: any;
            if (this.form.value.id) {
                const data = {...this.form.value};
                res1 = await this.graphQLService.mutationUpdateGraphQL(
                    'update_fisio_professioni',
                    'fisio_professioni_set_input',
                    data,
                    'codice',
                    this.form.value.codice,
                    'Int');
            } else {
                const data = {...this.form.value};
                delete data.id;
                res1 = this.graphQLService.mutationInsertGraphQL(
                    'insert_fisio_professioni',
                    'fisio_professioni_insert_input',
                    data);
            }
            this.utilsService.loaderActive = false;
            console.log(res1);
            if (res1.errors) {
                this.utilsService.showError();
                return;
            }
            if (res1?.update_fisio_professioni?.affected_rows === 0) {
                this.utilsService.showError();
                return;
            }
            this.utilsService.goBack();
        });
    }
}
