import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../../services/utils/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginService} from '../../../services/login/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {GenericConfirmComponent} from '../../../components/generic-confirm/generic-confirm.component';
import {BsModalService} from 'ngx-bootstrap';
import {ProfessioniService} from '../../../services/professioni/professioni.service';

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
        private professioniService: ProfessioniService
    ) {
        this.route.params.subscribe(async params => {
            let currentProfessione;
            if (params?.codice) {
                const data: any = await this.professioniService.getProfessione(params.codice);
                if (data?.fisio_professioni) {
                    currentProfessione = data?.fisio_professioni[0];
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
            if (this.currentProfessione) {
                res1 = await this.professioniService.updateProfessione(this.form.value);
            } else {
                res1 = await this.professioniService.insertProfessione(this.form.value);
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
