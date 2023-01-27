import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {GraphQLService} from '../../../services/graphQL/graphQL.service';

@Component({
    selector: 'relatore-detail',
    templateUrl: './relatore-detail.template.html'
})
export class RelatoreDetailComponent implements OnInit {
    form: FormGroup;
    relatoriForm: FormGroup;
    dataReceived = false;
    currentRelatore;

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
            let currentRelatore;
            if (params?.id) {
                const data: any = await this.graphQLService.getCustomGraphQL(`query MyQuery {
              fisio_relatori_anag(where: {id: {_eq: ${params.id}}}) {
                name
                struttura
                provenienza
                mobile
                id
                email
                disciplina
                created_at
                cod_fisc
                relatori {
                  struttura
                  name
                  id
                  disciplina
                  created_at
                }
              }
            }`);
                if (data?.data?.fisio_relatori_anag) {
                    currentRelatore = data?.data?.fisio_relatori_anag[0];
                    this.currentRelatore = currentRelatore;
                    console.log('currentDisciplina', this.currentRelatore);
                    if (!currentRelatore) {
                        this.utilsService.goBack();
                        return;
                    }
                }
            }
            this.setForm(currentRelatore);
            this.dataReceived = true;
        });
    }

    async setForm(currentRelatore) {
        this.form = this.fb.group({
            id: [currentRelatore?.id],
            cod_fisc: [currentRelatore?.cod_fisc, [Validators.required]],
            email: [currentRelatore?.email],
            mobile: [currentRelatore?.mobile],
            name: [currentRelatore?.name, [Validators.required]],
            provenienza: [currentRelatore?.provenienza]
        });
        this.relatoriForm = this.fb.group({
            struttura: [currentRelatore?.relatori?.struttura],
            disciplina: [currentRelatore?.relatori?.disciplina],
            name: [currentRelatore?.name],
        });
    }

    ngOnInit() {
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const bsModalRef = this.modalService.show(GenericConfirmComponent, {
            initialState: {
                title: this.form.value.id ? 'Aggiorna relatore' : 'Crea relatore',
                text: `Confermi di voler ${this.form.value.id ? 'aggiornare' : 'creare'} il relatore?`
            }
        });
        bsModalRef.content.eventYes.subscribe(async res => {
            this.utilsService.loaderActive = true;

            let res1: any;
            let res2: any;
            if (this.currentRelatore) {
                if (this.currentRelatore.relatori) {
                    res1 = await this.updateFisioRelatoriToProv();
                } else {
                    res1 = await this.insertFisioRelatoriToProv();
                }
                res2 = await this.updateFisioRelatoriAnag();
            } else {
                res1 = await this.insertFisioRelatoriToProv();
                res2 = await this.insertFisioRelatoriAnag();
            }
            this.utilsService.loaderActive = false;
            if (res1.errors || res2.errors) {
                this.utilsService.showError();
                return;
            }
            if (!this.currentRelatore) {
                if (res1?.insert_fisio_relatori_to_prov?.affected_rows === 0 ||
                    res2?.insert_fisio_relatori_anag?.affected_rows === 0) {
                    this.utilsService.showError();
                    return;
                }
            }
            this.utilsService.goBack();
        });
    }

    private async updateFisioRelatoriToProv() {
        const data = {...this.relatoriForm.value};
        data.name = this.form.value.name;
        return await this.graphQLService.mutationUpdateGraphQL(
            'update_fisio_relatori_to_prov',
            'fisio_relatori_to_prov_set_input',
            data,
            'name',
            this.relatoriForm.value.name,
            'String');
    }

    async insertFisioRelatoriToProv() {
        this.relatoriForm.value.name = this.form.value.name;
        return await this.graphQLService.mutationInsertGraphQL(
            'insert_fisio_relatori_to_prov',
            'fisio_relatori_to_prov_insert_input',
            this.relatoriForm.value);
    }

    async updateFisioRelatoriAnag() {
        const data1 = {...this.form.value};
        return await this.graphQLService.mutationUpdateGraphQL(
            'update_fisio_relatori_anag',
            'fisio_relatori_anag_set_input',
            data1,
            'id',
            this.form.value.id,
            'Int');
    }

    async insertFisioRelatoriAnag() {
        const data2 = {...this.form.value};
        delete data2.id;
        return await this.graphQLService.mutationInsertGraphQL(
            'insert_fisio_relatori_anag',
            'fisio_relatori_anag_insert_input',
            data2);
    }
}
