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
                const data: any = await this.graphQLService.getFisioRelatore(params.id);
                if (data?.fisio_relatori_anag) {
                    currentRelatore = data?.fisio_relatori_anag[0];
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
            provenienza: [currentRelatore?.provenienza],
            struttura: [currentRelatore?.struttura],
            disciplina: [currentRelatore?.disciplina],
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
            if (this.currentRelatore) {
                res1 = await this.graphQLService.updateRelatore(this.form.value);
            } else {
                const data = {...this.form.value};
                delete data.id;
                res1 = await this.graphQLService.insertRelatore(data);
            }
            this.utilsService.loaderActive = false;
            if (res1.errors) {
                this.utilsService.showError();
                return;
            }
            if (!this.currentRelatore) {
                if (res1?.insert_fisio_relatori_anag?.affected_rows === 0) {
                    this.utilsService.showError();
                    return;
                }
            }
            this.utilsService.goBack();
        });
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
